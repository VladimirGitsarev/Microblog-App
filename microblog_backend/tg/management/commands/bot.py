from django.core.management.base import BaseCommand
from django.conf import settings

from telegram import Bot, Update
from telegram.ext import Updater, MessageHandler, CommandHandler,  Filters, CallbackContext
from telegram.utils.request import Request

from tg.models import TelegramUser


def do_echo(update: Update, context: CallbackContext):
    chat_id = update.message.chat_id
    text = update.message.text
    full_name = f'{update.message.chat.first_name} {update.message.chat.last_name}'
    username = update.message.chat.username

    reply_text = f'User ID: {chat_id}\nFull name: {full_name}\nUsername: {username}\nMessage: {text}'

    print(reply_text)
    update.message.reply_text(
        text=reply_text
    )


def start_command(update: Update, context: CallbackContext):
    tg_id = update.message.chat_id
    username = update.message.chat.username
    first_name, last_name = update.message.chat.first_name, update.message.chat.last_name

    obj, _ = TelegramUser.objects.update_or_create(
        tg_id=tg_id,
        defaults={'username': username, 'first_name': first_name, 'last_name': last_name},
    )

    full_name = first_name + (" " + last_name) if last_name else ''
    reply_text = f'*Welcome to Microblog Telegram,* _{full_name}_\n\n' \
                 f'Enter this code on your Microblog profile page to connect the telegram bot to your account: *{tg_id}*'

    print(reply_text)
    update.message.reply_text(
        text=reply_text,
        parse_mode="Markdown"
    )


class Command(BaseCommand):
    help = 'Telegram bot'

    def handle(self, *args, **options):
        tg_bot = TelegramBot()
        start_handler = CommandHandler('start', start_command)
        tg_bot.updater.dispatcher.add_handler(start_handler)

        message_handler = MessageHandler(Filters.text, do_echo)
        tg_bot.updater.dispatcher.add_handler(message_handler)

        tg_bot.updater.start_polling()
        tg_bot.updater.idle()


class TelegramBot:
    def __init__(self):
        self.request = Request(
            connect_timeout=0.5,
            read_timeout=1.0,
        )

        self.bot = Bot(
            request=self.request,
            token=settings.TELEGRAM_TOKEN,
        )

        print(self.bot.get_me())

        self.updater = Updater(
            bot=self.bot,
            use_context=True,
        )

