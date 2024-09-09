import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();


export const zippyApi = axios.create({
  baseURL: 'http://161.35.56.41/zippy_world_live_api/bzm/api/agent_details',
    method: 'post',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'x-api-key': '6012451',
  },
});

export const zippyOtpApi = axios.create({
  baseURL: 'http://194.163.149.51:3009/api/v1/send_verify_otp',
  method: 'post',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'x-api-key': '2aa1513c-8998-454e-9d52-fa95b47fb142',
  },
});

export const zippyDebitApi = axios.create({
  baseURL: 'http://194.163.149.51:3009/api/v1/debit_zippywallet',
  method: 'post',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'x-api-key': '2aa1513c-8998-454e-9d52-fa95b47fb142',
  },
});