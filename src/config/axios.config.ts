import { ConfigService } from "@nestjs/config";
import axios from "axios";

export const axiosConfig = (configService: ConfigService) => {
  const baseURL = configService.get<string>("LENDSQR_BASE_URL");
  const apiKey = configService.get<string>("LENDSQR_API_KEY");

  return axios.create({
    baseURL,
    headers: { Authorization: `Bearer ${apiKey}` },
  });
};
