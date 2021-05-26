import factory

from factory.django import DjangoModelFactory
from pytest_factoryboy import register

from authentication.models import User


@register
class UserFactory(DjangoModelFactory):

    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    username = factory.LazyAttribute(
        lambda obj: '{}.{}'.format(
            obj.first_name.lower(),
            obj.last_name.lower()
            )
        )
    email = factory.LazyAttribute(
        lambda obj: '{}.{}@example.com'.format(
            obj.first_name.lower(),
            obj.last_name.lower()
            )
        )

    class Meta:
        model = User