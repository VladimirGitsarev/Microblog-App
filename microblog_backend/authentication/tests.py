import factory
import pytest
import faker
from rest_framework import status

from rest_framework.reverse import reverse

from authentication.models import User
from core.tests.factories import UserFactory
from core.tests.fixtures import api_client, auth_client

fake = faker.Faker()


@pytest.mark.django_db
@pytest.mark.parametrize(
    'endpoint', [
        'auth:user-list',
        'blog:posts-list',
        'chat:chats-list',
    ]
)
def test_unauthorized_request(endpoint, api_client):
    url = reverse(endpoint)
    response = api_client.get(url)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
@pytest.mark.parametrize(
    'endpoint', [
        'auth:user-list',
        'blog:posts-list',
        'chat:chats-list',
    ]
)
def test_authorized_profile(endpoint, auth_client):
    url = reverse(endpoint)
    response = auth_client.get(url)
    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
@pytest.mark.parametrize(
    'data, status_code', [
        pytest.param(
            [], status.HTTP_400_BAD_REQUEST,
            id='empty_data'
        ),
        pytest.param(
            ['test'], status.HTTP_400_BAD_REQUEST,
            id='username_only'
        ),
        pytest.param(
            ['test', 'test'], status.HTTP_400_BAD_REQUEST,
            id='username_password'
        ),
        pytest.param(
            ['test', 'test', 'Test', 'User', 'test@gmail.com'], status.HTTP_201_CREATED,
            id='valid_credentials_provided'
        )
    ]
)
def test_register_user(data, status_code, api_client):
    url = reverse('auth:register_user')
    fields = ['username', 'password', 'first_name', 'last_name', 'email']
    new_data = dict(zip(fields, data))
    response = api_client.post(url, data=new_data)
    assert response.status_code == status_code


@pytest.mark.django_db
def test_create_user(api_client):
    user_data = factory.build(dict, FACTORY_CLASS=UserFactory)
    url = reverse('auth:register_user')
    response = api_client.post(url, data=user_data)
    assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
def test_update_user(auth_client):
    url = reverse('auth:user-list')
    response = auth_client.get(url)
    user_data = factory.build(dict, FACTORY_CLASS=UserFactory)
    user_data.pop('password')
    url = reverse('auth:user-detail', kwargs={'pk': response.data[0].get('id')}).replace('users', 'user')
    response = auth_client.patch(url, user_data)
    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_reset_password_email(api_client):
    user = UserFactory(first_name=fake.first_name(), last_name=fake.last_name())
    url = reverse('auth:reset_password')
    response = api_client.post(url, data={'username': user.username})
    assert response.status_code == status.HTTP_200_OK
    assert response.data.get('details') == f"message was sent to {user.email} to reset the password"


@pytest.mark.django_db
def test_follow_user(auth_client):
    url = reverse('auth:user-list').replace('users', 'user')
    current_user_data = auth_client.get(url).data
    user = UserFactory(first_name=fake.first_name(), last_name=fake.last_name())
    url = reverse('auth:user-follow', kwargs={'pk': user.id})
    response = auth_client.post(url)
    assert response.status_code == status.HTTP_200_OK
    assert current_user_data.get('username') in user.followers.all().values_list('username', flat=True)


@pytest.mark.django_db
def test_get_followers(auth_client):
    url = reverse('auth:user-list').replace('users', 'user')
    current_user_data = auth_client.get(url).data
    user = UserFactory(first_name=fake.first_name(), last_name=fake.last_name())
    user.following.add(User.objects.get(id=current_user_data.get('id')))
    url = reverse('auth:user-followers')
    response = auth_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert user.username == response.data[0].get('username')
