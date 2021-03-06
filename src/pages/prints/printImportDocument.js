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
                ??T: ${company.mobile || ''}
              </div>
            </div>
            <div class="header-right">
              <div>
                M?? bi??n b???n: ${document.code}
              </div>
            </div>
          </div>
          <div class="clr"></div>
          <div class="titileDocument">
            <div class="title">????N ?????T H??NG</div>
          </div>
          <div class="info">
            <div>
              <b>Nh?? cung c???p:</b> ${document.srcVendor?.name || ''}
            </div>
            <div>
              <b>?????a ch???:</b> ${document.srcVendor?.address || ''}
            </div>
            <div
              style="display: grid; grid-template-columns: 60% 30%;"
            >
              <div>
                <b>??i???n tho???i:</b> ${document.srcVendor?.mobile || ''}
              </div>
              <div>
                <b>H.th???c thanh to??n:</b> Ti???n m???t
              </div>
            </div>
            <div>
              <b>Chi nh??nh nh???p:</b> ${document.desCompany?.name || ''}
            </div>
            <div>
              <b>?????a ch??? chi nh??nh:</b> ${document.desCompany?.address || ''}
            </div>
            <div>
              <b>??T chi nh??nh:</b> ${document.desCompany?.mobile || ''}
            </div>
            <div style="margin-top: 0.5cm">
              <table style="width:100%">
                <tbody>
                  <tr>
                    <th>STT</th>
                    <th>T??n h??ng</th>
                    <th>SL nh???p</th>
                    <th>Gi?? nh???p</th>
                    <th>Th??nh ti???n</th>
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
                    <td style="font-weight: bold; text-align: end;">T???ng ti???n:</td>
                    <td style="font-weight: bold; text-align: end;">${FormatNumber(totalDocument || 0)}</td>
                  </tr>
                  <tr>
                    <td colspan="3"></td>
                    <td style="font-weight: bold; text-align: end;">Ph?? v???n chuy???n:</td>
                    <td style="font-weight: bold; text-align: end;">0</td>
                  </tr>
                  <tr>
                    <td colspan="3"></td>
                    <td style="font-weight: bold; text-align: end; border-top: 1.5px solid;">T???NG TI???N:</td>
                    <td style="font-weight: bold; text-align: end; border-top: 1.5px solid;">${FormatNumber(totalDocument || 0)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div style="margin: 1cm 0px">
              <div>
                <b>
                  Ti???n b???ng ch???:
                </b>
                <i>${totalStr}</i>
              </div>
            </div>
            <div>
              <div class="signature">
                <div class="title">
                  Ng?????i l???p
                </div>
                <div><i>....., ng??y ${moment().get('date')} th??ng ${moment().get('month') + 1} n??m ${moment().get('year')}</i></div>
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
