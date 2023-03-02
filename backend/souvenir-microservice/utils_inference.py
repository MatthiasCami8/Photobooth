import os
import cv2
import torch
import numpy as np
from PIL import Image
import torch.nn.functional as F
from torchvision import transforms
from models.models import create_model
from options.test_options import TestOptions
from insightface_func.face_detect_crop_multi import Face_detect_crop as Face_detect_crop_multi
from util.add_watermark import watermark_image
from util.reverse2original import reverse2wholeimage
from util.norm import SpecificNorm
from parsing_model.model import BiSeNet
import gc
from contextlib import contextmanager
import time
import os
import psutil

transformer = transforms.Compose([
        transforms.ToTensor(),
    ])

transformer_Arcface = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

detransformer = transforms.Compose([
        transforms.Normalize([0, 0, 0], [1/0.229, 1/0.224, 1/0.225]),
        transforms.Normalize([-0.485, -0.456, -0.406], [1, 1, 1])
    ])

process=psutil.Process(os.getpid())


def totensor(array):
    tensor = torch.from_numpy(array)
    img = tensor.transpose(0, 1).transpose(0, 2).contiguous()
    return img.float().div(255)


def get_cuda_mem():
  r = torch.cuda.memory_reserved(0)
  a = torch.cuda.memory_allocated(0)
  return (r-a)/1024


@contextmanager
def timer(description: str) -> None:
    start = time.time()
    print(f'Mem before: {process.memory_info()[0]/1024}, {get_cuda_mem()}')
    yield
    print(f'Mem after: {process.memory_info()[0]/1024}, {get_cuda_mem()}')
    ellapsed_time = time.time() - start

    print(f"[TIMER]\t{description}: {ellapsed_time:.2f} s")

def show_mem():
  gc.collect()
  torch.cuda.empty_cache()

opt = TestOptions()
opt.initialize()
opt.parser.add_argument('-f') ## dummy arg to avoid bug
opt = opt.parse()


opt.Arc_path = 'arcface_model/arcface_checkpoint.tar'
opt.checkpoints_dir = './checkpoints'
opt.output_path = 'output/'
opt.temp_path = './temp_results'

opt.isTrain = False
opt.use_mask = True



start_epoch, epoch_iter = 1, 0
crop_size = opt.crop_size

torch.nn.Module.dump_patches = True
mode = 'None'

logoclass = watermark_image('./simswaplogo/ml6_logo.png')



