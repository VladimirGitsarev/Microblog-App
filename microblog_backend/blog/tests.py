import random

import factory
import pytest
import faker
from rest_framework import status

from rest_framework.reverse import reverse

from authentication.models import User
from blog.models import Post, Comment

from core.tests.factories import PostFactory, UserFactory, CommentFactory, VoteFactory, OptionFactory
from core.tests.fixtures import api_client, auth_client

fake = faker.Faker()


@pytest.mark.django_db
def test_get_posts(auth_client):
    url = reverse('blog:posts-list')
    response = auth_client.get(url)

    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_get_recommended_posts(auth_client):
    url = reverse('blog:posts-recommend')
    response = auth_client.get(url)

    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_create_post(auth_client):
    url = reverse('auth:user-list').replace('users', 'user')
    current_user_data = auth_client.get(url).data
    url = reverse('blog:posts-list')
    post_data = factory.build(dict, FACTORY_CLASS=PostFactory)
    response = auth_client.post(url, data=post_data)

    assert response.status_code == status.HTTP_201_CREATED
    assert response.data.get('user') == current_user_data.get('id')


@pytest.mark.django_db
def test_create_repost(auth_client):
    url = reverse('auth:user-list').replace('users', 'user')
    current_user_data = auth_client.get(url).data
    post = PostFactory(user_id=current_user_data.get('id'))
    url = reverse('blog:posts-list')
    post_data = factory.build(dict, FACTORY_CLASS=PostFactory)
    post_data['repost'] = post.id
    response = auth_client.post(url, data=post_data)

    assert response.status_code == status.HTTP_201_CREATED
    assert post.id == response.data.get('repost')


@pytest.mark.django_db
def test_create_vote(auth_client):
    post_data = factory.build(dict, FACTORY_CLASS=PostFactory)
    post_data['options'] = ",".join(fake.sentence(nb_words=3) for i in range(random.randint(0, 5)))
    url = reverse('blog:posts-list')
    response = auth_client.post(url, data=post_data)

    assert response.status_code == status.HTTP_201_CREATED
    assert response.data.get('vote')


@pytest.mark.django_db
def test_get_post(auth_client):
    url = reverse('auth:user-list').replace('users', 'user')
    current_user_data = auth_client.get(url).data
    post = PostFactory(user_id=current_user_data.get('id'))
    url = reverse('blog:posts-detail', kwargs={'pk': post.id})
    response = auth_client.get(url)

    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_delete_post(auth_client):
    url = reverse('auth:user-list').replace('users', 'user')
    current_user_data = auth_client.get(url).data
    post = PostFactory(user_id=current_user_data.get('id'))
    url = reverse('blog:posts-detail', kwargs={'pk': post.id})
    response = auth_client.delete(url)
    post = Post.objects.get(id=post.id)

    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert post.soft_deleted is True


@pytest.mark.django_db
def test_get_posts_likes(auth_client):
    url = reverse('auth:user-list').replace('users', 'user')
    current_user_data = auth_client.get(url).data
    post = PostFactory(user_id=current_user_data.get('id'))
    user = User.objects.get(id=current_user_data.get('id'))
    post.likes.add(user)
    url = reverse('blog:posts-likes', kwargs={'pk': post.id})
    response = auth_client.get(url)

    assert response.status_code == status.HTTP_200_OK
    assert response.data[0].get('id') == user.id


@pytest.mark.django_db
def test_get_posts_dislikes(auth_client):
    url = reverse('auth:user-list').replace('users', 'user')
    current_user_data = auth_client.get(url).data
    post = PostFactory(user_id=current_user_data.get('id'))
    user = User.objects.get(id=current_user_data.get('id'))
    post.dislikes.add(user)
    url = reverse('blog:posts-dislikes', kwargs={'pk': post.id})
    response = auth_client.get(url)

    assert response.status_code == status.HTTP_200_OK
    assert response.data[0].get('id') == user.id


@pytest.mark.django_db
def test_add_comment(auth_client):
    url = reverse('auth:user-list').replace('users', 'user')
    current_user_data = auth_client.get(url).data
    post = PostFactory(user_id=current_user_data.get('id'))
    url = reverse('blog:posts-comments', kwargs={'pk': post.id})
    comment_data = factory.build(dict, FACTORY_CLASS=PostFactory)
    response = auth_client.post(url, data=comment_data)

    assert response.status_code == status.HTTP_201_CREATED
    assert response.data.get('user').get('id') == current_user_data.get('id')
    assert response.data.get('post') == post.id


@pytest.mark.django_db
def test_get_comment(auth_client):
    url = reverse('auth:user-list').replace('users', 'user')
    current_user_data = auth_client.get(url).data
    post = PostFactory(user_id=current_user_data.get('id'))
    comment = CommentFactory(user_id=current_user_data.get('id'), post=post)
    url = reverse('blog:comments-detail', kwargs={'pk': comment.id})
    response = auth_client.get(url)

    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_get_comments(auth_client):
    url = reverse('auth:user-list').replace('users', 'user')
    current_user_data = auth_client.get(url).data
    post = PostFactory(user_id=current_user_data.get('id'))
    url = reverse('blog:posts-comments', kwargs={'pk': post.id})
    comment = CommentFactory(user_id=current_user_data.get('id'), post=post)
    response = auth_client.get(url)

    assert response.status_code == status.HTTP_200_OK
    assert comment.id == response.data[0].get('id')


@pytest.mark.django_db
def test_delete_comment(auth_client):
    url = reverse('auth:user-list').replace('users', 'user')
    current_user_data = auth_client.get(url).data
    post = PostFactory(user_id=current_user_data.get('id'))
    comment = CommentFactory(user_id=current_user_data.get('id'), post=post)
    url = reverse('blog:comments-detail', kwargs={'pk': comment.id})
    response = auth_client.delete(url)
    comment = Comment.objects.get(id=comment.id)

    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert comment.soft_deleted is True


@pytest.mark.django_db
def test_get_vote(auth_client):
    url = reverse('auth:user-list').replace('users', 'user')
    current_user_data = auth_client.get(url).data
    vote = VoteFactory()
    PostFactory(user_id=current_user_data.get('id'), vote=vote)
    options_count = random.randint(1, 5)
    for i in range(options_count):
        OptionFactory(vote=vote)
    url = reverse('blog:votes-detail', kwargs={'pk': vote.id})
    response = auth_client.get(url)

    assert response.status_code == status.HTTP_200_OK
    assert len(response.data.get('options')) == options_count


@pytest.mark.django_db
def test_vote(auth_client):
    url = reverse('auth:user-list').replace('users', 'user')
    current_user_data = auth_client.get(url).data
    vote = VoteFactory()
    PostFactory(user_id=current_user_data.get('id'), vote=vote)
    options = []
    for i in range(random.randint(1, 5)):
        option = OptionFactory(vote=vote)
        options.append(option)
    url = reverse('blog:votes-vote', kwargs={'pk': vote.id})
    response = auth_client.post(url, data={'option': options[0].id})

    assert response.status_code == status.HTTP_200_OK
    assert current_user_data.get('id') in response.data.get('vote').get('users')
    assert current_user_data.get('id') in response.data.get('vote').get('options')[0].get('users')
