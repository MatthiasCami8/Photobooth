from utils_inference import *
def export_model():

  with timer('create model'):
    model = create_model(opt)
    model.eval()


  input_target = torch.randn(1,3,224,224).to('cuda')
  input_id = torch.randn(1,1,512).to('cuda')

  model_trt = torch2trt(model.netG, [input_target, input_id]).cpu()
  # model_trt = model_trt.to('cpu')
  del model
  del input_target, input_id
  show_mem()
  print(model_trt)

  # input_target = torch.randn(1,3,224,224).to('cuda')
  # input_id = torch.randn(1,1,512).to('cuda')
  
  """
  with timer('RT model'):
    for i in range(30):
      print(i)
      model_trt(input_target, input_id)
  """
  show_mem()
  time.sleep(2)
  
  torch.save(model_trt.state_dict(), 'model_fp32_test.pth')
  print('done')


def export_netarc_model():

  with timer('create model'):
    model = create_model(opt)
    model.eval()


  input_target = torch.randn(1,3,112,112).to('cuda')
	
  print('creating torch trt')
  with timer('rt conversion'):
    model_trt = torch2trt(model.netArc, [input_target], fp16_mode=True)
  print('save dict')
  torch.save(model_trt.state_dict(), 'model_fp16_netArc.pth')
  
  show_mem()
  print(model_trt)
  
 
  with timer('RT model'):
    for i in range(30):
      print(i)
      model_trt(input_target)

  
  with timer('model'):
    for i in range(30):
      print(i)
      model.netArc(input_target)

    

def load_benchmark_model():

  model_trt = TRTModule()
  model_trt.load_state_dict(torch.load('model_fp32.pth'))
  print(model_trt)


  input_target = torch.randn(1,3,224,224).to('cuda')
  input_id = torch.randn(1,1,512).to('cuda')


  input_target = input_target.half()
  input_id = input_id.half()

  with timer('RT model'):
    for i in range(30):
      print(i)
      model_trt(input_target, input_id)

if __name__ == '__main__':
  export_netarc_model()







