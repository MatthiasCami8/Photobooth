import json
from util.reverse2original import SoftErosion, encode_segmentation_rgb, postprocess
import cv2
import torch
import numpy as np

with open('data.json', 'r') as f:
  meta_data_load = json.load(f)

def reverse2wholeimage_(b_align_crop_tensor_list,
                       swapped_imgs,
                       mats,
                       preproc_masks,
                       crop_size,
                       original_img,
                       save_path = '',
                       ):

    target_image_list = []
    img_mask_list = []
    smooth_mask = SoftErosion(kernel_size=17, threshold=0.9, iterations=7).cuda()

    for swapped_img, mat, source_img, preproc_mask in zip(swapped_imgs, mats, b_align_crop_tensor_list, preproc_masks):
        swapped_img = swapped_img.cpu().detach().numpy().transpose((1, 2, 0))
        img_white = np.full((crop_size,crop_size), 255, dtype=float)

        # inverse the Affine transformation matrix
        mat_rev = np.zeros([2,3])
        div1 = mat[0][0]*mat[1][1]-mat[0][1]*mat[1][0]
        mat_rev[0][0] = mat[1][1]/div1
        mat_rev[0][1] = -mat[0][1]/div1
        mat_rev[0][2] = -(mat[0][2]*mat[1][1]-mat[0][1]*mat[1][2])/div1
        div2 = mat[0][1]*mat[1][0]-mat[0][0]*mat[1][1]
        mat_rev[1][0] = mat[1][0]/div2
        mat_rev[1][1] = -mat[0][0]/div2
        mat_rev[1][2] = -(mat[0][2]*mat[1][0]-mat[0][0]*mat[1][2])/div2

        orisize = (original_img.shape[1], original_img.shape[0])

        # extract segmentation
        tgt_mask = preproc_mask
        
        if tgt_mask.sum() >= 5000:
            target_mask = cv2.resize(tgt_mask, (crop_size,  crop_size))
            target_image_parsing = postprocess(swapped_img, source_img[0].cpu().detach().numpy().transpose((1, 2, 0)), target_mask,smooth_mask)
            

            target_image = cv2.warpAffine(target_image_parsing, mat_rev, orisize)
        else:
            target_image = cv2.warpAffine(swapped_img, mat_rev, orisize)[..., ::-1]
        
        img_white = cv2.warpAffine(img_white, mat_rev, orisize)
        img_white[img_white>20] = 255
        img_mask = img_white

        kernel = np.ones((40,40),np.uint8)
        img_mask = cv2.erode(img_mask,kernel,iterations = 1)
        kernel_size = (20, 20)
        blur_size = tuple(2*i+1 for i in kernel_size)
        img_mask = cv2.GaussianBlur(img_mask, blur_size, 0)
        img_mask /= 255
        img_mask = np.reshape(img_mask, [img_mask.shape[0],img_mask.shape[1],1])

        target_image = np.array(target_image, dtype=np.float) * 255

        img_mask_list.append(img_mask)
        target_image_list.append(target_image)
        
    img = np.array(original_img, dtype=np.float)
    for img_mask, target_image in zip(img_mask_list, target_image_list):
        img = img_mask * target_image + (1-img_mask) * img
        
    final_img = img.astype(np.uint8)
    cv2.imwrite(save_path, final_img)




    meta_stam = meta_data_load['stam_1']

