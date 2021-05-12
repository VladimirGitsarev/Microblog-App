from io import BytesIO
from PIL import Image
from django.core.files import File


class Compressor:
    def __init__(self, image):
        self.image = image

    def compress(self):
        im = Image.open(self.image)
        im = im.convert('RGB')
        im_io = BytesIO()
        im.save(im_io, 'JPEG', optimize=True, quality=50)
        new_image = File(im_io, name=self.image.name)
        return new_image
