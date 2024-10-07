import 'dotenv/config';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  configService = new ConfigService();
  private sender: string = process.env.SENDER;
  private pass: string = process.env.PASS_MAIL;

  async sendMail(message: string, rec?: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: 'smtp.yandex.ru',
      port: 465,
      secure: true,
      auth: {
        user: this.sender,
        pass: this.pass,
      },
    });
    const mailOption: nodemailer.SendMailOptions = {
      from: this.sender,
      to: rec,
      subject: 'This is your account password',
      text: message,
      html: `<i>${message}</i>`,
    };

    transporter.sendMail(mailOption, (error: Error | null) => {
      if (error) {
        console.error('Error occurred while sending email:', error);
      } else {
        console.log('Email sent successfully');
      }
    });
  }
}
