import pytest

from rest_framework.reverse import reverse

from core.tests.fixtures import api_client, auth_client


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
    assert response.status_code == 401


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
    assert response.status_code == 200


@pytest.mark.django_db
@pytest.mark.parametrize(
   'data, status_code', [
        pytest.param(
            ['test'], 400,
            id='username_only'
            ),
        pytest.param(
            ['test', 'test'], 400,
            id='username_password'
            ),
        pytest.param(
            ['test', 'test', 'Test', 'User', 'test@gmail.com'], 201,
            id='valid_credentials_provided'
            )
   ]
)
def test_create_user(data, status_code, api_client):
    url = reverse('auth:register_user')
    fields = ['username', 'password', 'first_name', 'last_name', 'email']
    new_data = dict(zip(fields, data))
    response = api_client.post(url, data=new_data)
    assert response.status_code == status_code
