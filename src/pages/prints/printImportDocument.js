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
        totalTran += quan * tran.buyPrice[idx]
      }
    })
    return t + totalTran
  }, 0)
  let totalStr = ReadVietnamese(totalDocument).trim()
  totalStr = `${totalStr[0].toUpperCase()}${totalStr.substr(1)}`
  const popupWin = window.open('', '_blank')
  popupWin.document.open()
  popupWin.document.write(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>phieuDatHang</title>
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
      .header {
        height: 2cm;
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
        text-transform: capitalize;
      }
      .clr {
        clear: both;
      }
      .titileDocument {
        display: flex;
        flex-flow: column;
        align-items: center;
        height: 2cm;
      }
      .titileDocument > .title {
        font-size: xx-large;
        font-weight: bolder;
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
      }
      .signature .title{
        font-weight: bold;
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
              <div>
                Mã biên bản: ${document.code}
              </div>
            </div>
          </div>
          <div class="clr"></div>
          <div class="titileDocument">
            <div class="title">ĐƠN ĐẶT HÀNG</div>
          </div>
          <div class="info">
            <div>
              <b>Nhà cung cấp:</b> ${document.srcVendor?.name || ''}
            </div>
            <div>
              <b>Địa chỉ:</b> ${document.srcVendor?.address || ''}
            </div>
            <div
              style="display: grid; grid-template-columns: 60% 30%;"
            >
              <div>
                <b>Điện thoại:</b> ${document.srcVendor?.mobile || ''}
              </div>
              <div>
                <b>H.thức thanh toán:</b> Tiền mặt
              </div>
            </div>
            <div>
              <b>Chi nhánh nhập:</b> ${document.desCompany?.name || ''}
            </div>
            <div>
              <b>Địa chỉ chi nhánh:</b> ${document.desCompany?.address || ''}
            </div>
            <div>
              <b>ĐT chi nhánh:</b> ${document.desCompany?.mobile || ''}
            </div>
            <div style="margin-top: 0.5cm">
              <table style="width:100%">
                <tbody>
                  <tr>
                    <th>STT</th>
                    <th>Tên hàng</th>
                    <th>SL nhập</th>
                    <th>Giá nhập</th>
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
                          stran.buyPrice?.reduce((t, price, idx) => {
                            if (price) {
                              return `${t}, 1 ${stran.stockModel?.detail?.unit[idx] || ''} = ${FormatNumber(price)}` 
                            }
                            return t
                          }, '').substr(2)
                        }</td>
                        <td style="text-align: end;">${
                          FormatNumber(stran.quantity?.reduce((t, quan, idx) => {
                            if (quan) {
                              return t + quan * stran.buyPrice[idx]
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
            <div style="margin: 1cm 0px">
              <div>
                <b>
                  Tiền bằng chữ:
                </b>
                <i>${totalStr}</i>
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
        </div>
      </page>
    </main>
  </body>
  </html>`)
  popupWin.document.close()
  popupWin.focus()
  setTimeout(() => {
    popupWin.print()
    popupWin.close()
  }, 300)
}
