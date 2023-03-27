from utils_inference import *
from config import RESULTS_DIR
# from preproc_code import *
# init cuda and settings

print('importing prediction.py')

# load model
with timer('create model'):
  model = create_model(opt)
  model.eval()

with timer('bisenet loading'):
  n_classes = 19
  bi_se_net = BiSeNet(n_classes=n_classes)
  #bi_se_net.cuda()
  save_pth = os.path.join('./parsing_model/checkpoint', '79999_iter.pth')
  bi_se_net.load_state_dict(torch.load(save_pth, map_location=torch.device('cpu')))
  bi_se_net.eval()

spNorm = SpecificNorm()


# single face detection
with timer('face detect prepare'):
  app_multi = Face_detect_crop_multi(name='antelope', root='./insightface_func/models')
  app_multi.prepare(ctx_id= 0, det_thresh=0.6, det_size=(640,640),mode=mode)



def encode_face_id_multi(source_path):
  img_source_whole = cv2.imread(source_path)
  img_source_crop, _ = app_multi.get(img_source_whole, crop_size)

  img_list = []
  for img in img_source_crop:
    img_list.append(
        transformer_Arcface(
            Image.fromarray(cv2.cvtColor(img,cv2.COLOR_BGR2RGB))
      )
    )
  img_source = torch.stack(img_list)
  img_id = img_source.view(-1, img_source.shape[1], img_source.shape[2], img_source.shape[3])#.cuda()

  #create latent id
  img_id_downsample = F.interpolate(img_id, size=(112,112))

  del img_id, img_source_whole

  latent_id = model.netArc(img_id_downsample)
  latent_id = F.normalize(latent_id, p=2, dim=1)
  del img_id_downsample
  return latent_id


def swap_many_to_many_faces(target, source_ids):

  img_b_whole = cv2.imread(target)

  img_b_align_crop_list, b_mat_list = app_multi.get(img_b_whole, crop_size)
  swap_result_list = []
  b_align_crop_tensor_list = []

  source_len = source_ids.shape[0]
  target_len = len(img_b_align_crop_list)
  result_len = min(source_len, target_len)

  print(f"{len(img_b_align_crop_list)} target faces\n{source_ids.shape[0]} source faces")

  if source_len == 1 and target_len > 1:
    for i in range(target_len):
      b_align_crop = img_b_align_crop_list[i]

      b_align_crop_tensor = totensor(cv2.cvtColor(b_align_crop,cv2.COLOR_BGR2RGB))[None,...]#.cuda()

      swap_result = model.netG(b_align_crop_tensor, source_ids[0])[0]
      swap_result_list.append(swap_result)
      b_align_crop_tensor_list.append(b_align_crop_tensor)


  else:
    for i in range(result_len):
      b_align_crop = img_b_align_crop_list[i]
      source_id = source_ids[i]

      b_align_crop_tensor = totensor(cv2.cvtColor(b_align_crop,cv2.COLOR_BGR2RGB))[None,...]#.cuda()

      swap_result = model.netG(b_align_crop_tensor, source_id)[0]
      swap_result_list.append(swap_result)
      b_align_crop_tensor_list.append(b_align_crop_tensor)

  del source_ids
  gc.collect()

  return img_b_whole, b_align_crop_tensor_list, b_mat_list, swap_result_list


def swap_many_to_many_faces_pipeline(target_url, source_url, result_img_path, logo):
  with timer('encode source face'): latent_ids = encode_face_id_multi(source_url)
  with timer('swap faces'): img_b_whole, b_align_crop_tensor_list, b_mat_list, swap_result = swap_many_to_many_faces(target_url, latent_ids)

  logo_swap = False
  if logo == "kmska":
      logoclass = watermark_image('./simswaplogo/kmska_logo.png', size=0.45)
  elif logo == "axelera":
      logoclass = None
      logo_swap = True
  else:
      logoclass = watermark_image('./simswaplogo/ml6_logo.png', size=0.25)
  # elif logo == "ml6_youseum":
  #     logoclass = watermark_image('./simswaplogo/ml6_youseum_logo.png')
  with timer('reverse2wholeimage'):
    reverse2wholeimage(b_align_crop_tensor_list,
                                swap_result,
                                b_mat_list,
                                crop_size,
                                img_b_whole,
                                logoclass,
                                result_img_path,
                                logo_swap,
                                pasring_model=bi_se_net,
                                use_mask=True,
                                norm = spNorm)

  del b_align_crop_tensor_list, swap_result, b_mat_list, latent_ids

  gc.collect()
  torch.cuda.empty_cache()




