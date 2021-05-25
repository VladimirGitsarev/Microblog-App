import datetime

from microblog_backend.settings import TELEGRAM_NOTIFICATION_INTERVAL
from tg.management.commands.bot import TelegramBot
from tg.models import TelegramUser
from blog.models import Post

from telegram.files.inputmedia import InputMediaPhoto
from celery import shared_task


@shared_task
def send_news():
    tg = TelegramBot()
    tg_users = TelegramUser.objects.all()
    for tg_user in tg_users:
        posts = Post.objects.filter(
            soft_deleted=False,
            user__in=tg_user.user.following.all(),
            created_at__gt=datetime.datetime.now() - datetime.timedelta(hours=TELEGRAM_NOTIFICATION_INTERVAL)
        )
        try:
            for post in posts:
                if post.repost:
                    message = f"*{post.user.first_name} {post.user.last_name}* _@{post.user.username}_\n\n" \
                              f"{post.body}\n\n" \
                              f"Repost from *{post.repost.user.first_name} {post.repost.user.last_name}* " \
                              f"_@{post.repost.user}_\n" \
                              f"`{post.repost.body}`\n\n" \
                              f"_See original post at http://0.0.0.0:3000/post/{post.id}_\n\n" \
                              f"_{post.created_at.strftime('%m/%d/%Y, %H:%M:%S')}_"
                else:
                    message = f"*{post.user.first_name} {post.user.last_name}* _@{post.user.username}_\n\n" \
                              f"{post.body}\n\n" \
                              f"_See original post at http://0.0.0.0:3000/post/{post.id}_\n\n" \
                              f"_{post.created_at.strftime('%m/%d/%Y, %H:%M:%S')}_"
                if post.images:
                    images = []
                    for index, img in enumerate(post.images):
                        if index == 0:
                            images.append(InputMediaPhoto(
                                media=img,
                                caption=message,
                                parse_mode="Markdown",
                            ))
                        else:
                            images.append(InputMediaPhoto(media=img))
                    tg.bot.send_media_group(
                        tg_user.tg_id,
                        images,
                        message,
                    )
                elif post.vote:
                    options = post.vote.option_set.all()
                    options_text = ''.join([u'\U0001F535' + ' ' + option.body + "\n" for option in options])
                    tg.bot.send_photo(
                        tg_user.tg_id,
                        "https://i.pinimg.com/736x/63/d9/0f/63d90fbe12e18709fa93167c10384905.jpg",
                        f"*{post.user.first_name} {post.user.last_name}* _@{post.user.username}_\n\n"
                        f"{post.body}\n{options_text}\n"
                        f"_The post has attached poll.\n "
                        f"See original post to vote at http://0.0.0.0:3000/post/{post.id}_\n\n"
                        f"_{post.created_at.strftime('%m/%d/%Y, %H:%M:%S')}_",
                        parse_mode="Markdown",
                    )
                else:
                    tg.bot.send_message(
                        tg_user.tg_id,
                        message,
                        "Markdown",
                    )
        except BaseException as e:
            print(e)