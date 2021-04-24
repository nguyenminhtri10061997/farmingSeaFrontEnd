import * as moment from 'moment'
import { FormatNumber, queryData } from '../../commons/commonFunc'
import { GET_DOCUMENT, GET_COMPANY } from './gql'
import { ReadVietnamese } from '../../commons/readNumber'

export default async (idDocument, idSrcCompany, currentUser) => {
  const [
    {
      data: {
        document
      } 
    },
    {
      data: {
        company
      } 
    }
  ] = await Promise.all([
    queryData(GET_DOCUMENT, {
      id: idDocument
    }),
    queryData(GET_COMPANY, {
      id: idSrcCompany
    }),
  ])
  const totalDocument = document?.sTransactions?.reduce((t, tran) => {
    let totalTran = 0
    tran.quantity.forEach((quan, idx) => {
      if (quan) {
        totalTran += quan * tran.salePrice[idx]
      }
    })
    return t + totalTran
  }, 0)
  let totalStr = ReadVietnamese(totalDocument).trim()
  totalStr = `${totalStr[0].toUpperCase()}${totalStr.substr(1)}`
  const popupWin = window.open('', '_blank')
  popupWin.document.open()
  popupWin.document.write(`<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>phieuBanHang</title>
    <style>
      * {
        box-sizing: border-box;
      }
      body {
        background: rgb(204, 204, 204);
        font-size: 14px;
      }
      page[size="A4"] {  
        width: 21cm;
        height: 29.7cm; 
      }
      .content {
        padding: 1cm;
      }
      .header {
        height: 3cm;
      }
      .header-left {
        float: left;
      }
      .header-right {
        float: right;
      }
      .titileCompany {
        font-size: larger;
        font-weight: bolder;
      }
      .clr {
        clear: both;
      }
      .titileDocument {
        display: flex;
        flex-flow: column;
        align-items: center;
        height: 1.5cm;
      }
      .titileDocument > .title {
        font-size: xx-large;
        font-weight: 1000;
      }
      .titileDocument > .date {
        font-style: italic;
      }
      .info {
        font-size: medium;
        line-height: 1.5;
      }
      table {
        border-collapse: collapse;
      }
      tbody th {
        border: 1px solid black;
        border-collapse: collapse;
      }
      tbody td {
        border: 1px solid black;
        border-collapse: collapse;
      }
      td {
        padding: 0 0.2cm;
      }
      .signature {
        float: right;
        display: flex;
        flex-flow: column;
        width: 7cm;
        align-items: center;
        font-size: medium;
        line-height: 1.5;
        margin-top: 0.5cm;
      }
      .signature .title{
        font-weight: bold;
      }
      .numberDocument {
        text-align: end;
      }
      .title-border {
        position: absolute;
        top: 2.3cm;
        border-bottom: 1px solid black;
        width: 6cm;
        display: inline-block;
        border-style: groove;
      }
      .title-icon-star {
        background: white;
        position: absolute;
        top: 2.2cm;
        width: 1cm;
        height: 0.5cm;
        display: inline-block;
        font-size: xx-large;
        line-height: 0.5cm;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <main>
      <page size="A4" layout="portrait">
        <div
          class="content"
        >
          <div class="header">
            <div class="header-left">
              <div class="titileCompany">
                ${company.name || ''}
              </div>
              <div>
                ${company.address || ''}
              </div>
              <div>
                ĐT: ${company.mobile || ''}
              </div>
            </div>
            <div class="header-right">
              <div class="titileDocument">
                <div class="title">HÓA ĐƠN BÁN HÀNG</div>
                <div class='title-border'></div>
                <div class='title-icon-star'>&#10031;</div>
              </div>
              <div class="numberDocument">
                Số: ${document.code.substr(3)}
              </div>
            </div>
          </div>
          <div class="clr"></div>
          <div class="info">
            <div style="display: grid; grid-template-columns: 70% 30%;">
              <div>
                <b>Họ tên khách hàng:</b> ${document.desCustomer?.fullName || ''}
              </div>
              <div>
                <b>ĐT:</b> ${document.desCustomer?.mobile || ''}
              </div>
            </div>
            <div>
              <b>Địa chỉ:</b> ${document.desCustomer?.address || ''}
            </div>
            <div style="margin-top: 0.5cm;">
              <table style="width:100%">
                <tbody>
                  <tr>
                    <th>STT</th>
                    <th>Tên hàng</th>
                    <th>Đơn vị</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                  </tr>
                  ${document.sTransactions?.map((stran, idx) => {
                    return `
                      <tr>
                        <td style="text-align: center;">${idx + 1}</td>
                        <td>${stran.stockModel?.name || ''}</td>
                        <td>${
                          stran.quantity?.reduce((t, quan, idx) => {
                            if (quan) {
                              return `${t}, ${quan} ${stran.stockModel?.detail?.unit[idx] || ''}` 
                            }
                            return t
                          }, '').substr(2)
                        }</td>
                        <td>${
                          stran.salePrice?.reduce((t, price, idx) => {
                            if (price) {
                              return `${t}, 1 ${stran.stockModel?.detail?.unit[idx] || ''} = ${FormatNumber(price)}` 
                            }
                            return t
                          }, '').substr(2)
                        }</td>
                        <td style="text-align: end;">${
                          FormatNumber(stran.quantity?.reduce((t, quan, idx) => {
                            if (quan) {
                              return t + quan * stran.salePrice[idx]
                            }
                            return t
                          }, 0))
                        }</td>
                      </tr>
                    `
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="3"></td>
                    <td style="font-weight: bold; text-align: end;">Tổng tiền:</td>
                    <td style="font-weight: bold; text-align: end;">${FormatNumber(totalDocument || 0)}</td>
                  </tr>
                  <tr>
                    <td colspan="3"></td>
                    <td style="font-weight: bold; text-align: end;">Phí vận chuyển:</td>
                    <td style="font-weight: bold; text-align: end;">0</td>
                  </tr>
                  <tr>
                    <td colspan="3"></td>
                    <td style="font-weight: bold; text-align: end; border-top: 1.5px solid;">TỔNG TIỀN:</td>
                    <td style="font-weight: bold; text-align: end; border-top: 1.5px solid;">${FormatNumber(totalDocument || 0)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div>
              <div>
                <b>
                  Tiền bằng chữ:
                </b>
                <i>${totalStr} đồng</i>
              </div>
            </div>
          </div>
          <div>
            <div class="signature">
              <div class="title">
                Người lập
              </div>
              <div><i>....., ngày ${moment().get('date')} tháng ${moment().get('month') + 1} năm ${moment().get('year')}</i></div>
              <div style="height: 2.5cm;"></div>
              <div>${currentUser?.username || ''}</div>
            </div>
          </div>
        </div>
      </page>
    </main>
  </body>
  </html>`)
  popupWin.document.close()
  popupWin.focus()
  setTimeout(() => {
    popupWin.print()
    // popupWin.close()
  }, 300)
}
