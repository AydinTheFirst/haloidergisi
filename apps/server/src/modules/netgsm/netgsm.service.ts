import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import axios from "axios";
import fs from "node:fs/promises";

type SendMessageOptions =
  | {
      context: Record<string, string>;
      template: string;
    }
  | string;

@Injectable()
export class NetgsmService implements OnModuleInit {
  private netgsm = axios.create({
    baseURL: "https://api.netgsm.com.tr",
  });

  private netgsmConf = {
    appkey: "xxx",
    password: process.env.NETGSM_PASSWORD,
    usercode: process.env.NETGSM_USERCODE,
  };

  private templateDir = process.cwd() + "/src/templates/sms";
  private templates = new Map<string, string>();

  constructor() {
    this.loadTemplates();
  }

  public async loadTemplates() {
    const files = await fs.readdir(this.templateDir);

    for (const file of files) {
      const template = await fs.readFile(this.templateDir + "/" + file, {
        encoding: "utf-8",
      });

      const templateName = file.split(".")[0];

      const templateContent = template.replace(/\r\n/g, "\n");

      this.templates.set(templateName, templateContent);
    }

    Logger.debug("Templates loaded", "NETGSM");
  }

  onModuleInit() {
    Logger.debug("Netgsm module initialized", "NETGSM");
  }

  public async sendSMS(gsmno: string, opts: SendMessageOptions) {
    let message = "";

    if (typeof opts === "string") {
      message = opts;
    } else {
      message = this.templates.get(opts.template) || "";
      for (const [key, value] of Object.entries(opts.context)) {
        message = message.replace(new RegExp(`{{${key}}}`, "g"), value);
      }
    }

    const res = await this.netgsm.post("/sms/send/get", null, {
      params: {
        ...this.netgsmConf,
        dil: "TR",
        gsmno,
        message,
        msgheader: process.env.NETGSM_USERCODE,
      },
    });

    Logger.debug(`SMS sent to ${gsmno} | Response ${res.data}`, "NETGSM");

    return res.data;
  }
}
