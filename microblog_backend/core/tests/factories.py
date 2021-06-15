import datetime

import factory
import faker

from factory.django import DjangoModelFactory
from pytest_factoryboy import register

from authentication.models import User
from blog.models import Post, Vote, Option, Comment

fake = faker.Faker()


@register
class UserFactory(DjangoModelFactory):

    first_name = fake.first_name()
    last_name = fake.last_name()
    username = factory.LazyAttribute(
        lambda obj: '{}.{}'.format(
                obj.first_name.lower(),
                obj.last_name.lower()
            )
        )
    email = factory.LazyAttribute(
        lambda obj: f'{obj.first_name.lower()}.{obj.last_name.lower()}@{fake.free_email_domain()}'
    )
    password = fake.password()
    birth_date = fake.past_date()
    location = f'{fake.city()}, {fake.country()}'
    status = fake.sentence()

    class Meta:
        model = User


@register
class PostFactory(DjangoModelFactory):

    body = fake.sentence()

    class Meta:
        model = Post


@register
class VoteFactory(DjangoModelFactory):

    expires = fake.date_this_year(before_today=False, after_today=True)

    class Meta:
        model = Vote


@register
class OptionFactory(DjangoModelFactory):

    body = fake.sentence(nb_words=3)

    class Meta:
        model = Option


@register
class CommentFactory(DjangoModelFactory):

    body = fake.sentence(nb_words=3)

    class Meta:
        model = Comment

