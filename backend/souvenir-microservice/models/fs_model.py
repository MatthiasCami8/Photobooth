import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
import os
from torch.autograd import Variable
from .base_model import BaseModel
from . import networks

class SpecificNorm(nn.Module):
    def __init__(self, epsilon=1e-8):
        """
            @notice: avoid in-place ops.
            https://discuss.pytorch.org/t/encounter-the-runtimeerror-one-of-the-variables-needed-for-gradient-computation-has-been-modified-by-an-inplace-operation/836/3
        """
        super(SpecificNorm, self).__init__()
        self.mean = np.array([0.485, 0.456, 0.406])
        self.mean = torch.from_numpy(self.mean).float().cuda()
        self.mean = self.mean.view([1, 3, 1, 1])

        self.std = np.array([0.229, 0.224, 0.225])
        self.std = torch.from_numpy(self.std).float().cuda()
        self.std = self.std.view([1, 3, 1, 1])

    def forward(self, x):
        mean = self.mean.expand([1, 3, x.shape[2], x.shape[3]])
        std = self.std.expand([1, 3, x.shape[2], x.shape[3]])

        x = (x - mean) / std

        return x

class fsModel(BaseModel):
    def name(self):
        return 'fsModel'

    def init_loss_filter(self, use_gan_feat_loss, use_vgg_loss):
        flags = (True, use_gan_feat_loss, use_vgg_loss, True, True, True, True, True)

        def loss_filter(g_gan, g_gan_feat, g_vgg, g_id, g_rec, g_mask, d_real, d_fake):
            return [l for (l, f) in zip((g_gan, g_gan_feat, g_vgg, g_id, g_rec, g_mask, d_real, d_fake), flags) if f]

        return loss_filter

    def initialize(self, opt):
        BaseModel.initialize(self, opt)
        if opt.resize_or_crop != 'none' or not opt.isTrain:  # when training at full res this causes OOM
            torch.backends.cudnn.benchmark = True
        self.isTrain = opt.isTrain

        device = torch.device("cuda:0")


        from .fs_networks import Generator_Adain_Upsample, Discriminator
        
        # Generator network
        self.netG = Generator_Adain_Upsample(input_nc=3, output_nc=3, latent_size=512, n_blocks=9, deep=False)
        #self.netG.to(device)


        # Id network
        netArc_checkpoint = opt.Arc_path
        netArc_checkpoint = torch.load(netArc_checkpoint, map_location=torch.device('cpu'))
        self.netArc = netArc_checkpoint['model'].module
        #self.netArc = self.netArc.to(device)
        self.netArc.eval()

        pretrained_path = '' if not self.isTrain else opt.load_pretrain
        self.load_network(self.netG, 'G', opt.which_epoch, pretrained_path)


