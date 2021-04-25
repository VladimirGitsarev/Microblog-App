from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import GenericViewSet
from rest_framework.response import Response
from rest_framework import status


class PostViewSet(GenericViewSet):

    permission_classes = (IsAuthenticated, )

    def get(self, request, *args, **kwargs):
        return Response({'detail': 'Get Post'}, status=status.HTTP_200_OK)
