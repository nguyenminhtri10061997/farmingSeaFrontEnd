import React, { useEffect, useReducer, useRef } from 'react'
import { reducer } from '../../commons/commonFunc'
import { Alert } from 'antd'

export default React.memo(() => {
  const [state, setState] = useReducer(reducer, {
    message: {
      title: arrTitle[getRndInteger(0, arrTitle.length - 1)],
      content: arrContent[getRndInteger(0, arrContent.length - 1)],
    },
  })

  const interval = useRef()

  useEffect(() => {
    fetch('https://community-open-weather-map.p.rapidapi.com/find?q=london&cnt=0&mode=null&lon=0&type=link%2C%20accurate&lat=0&units=imperial%2C%20metric', {
      'method': 'GET',
      'headers': {
        'x-rapidapi-key': '362c0d403dmsh821861f42bfeb04p1ac82ajsna7990c7e8a58',
        'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com'
      }
    })
    .then(response => {
      console.log(response);
    })
    .catch(err => {
      console.error(err);
    })
    interval.current = setInterval(() => {
      const numRandomTitle = getRndInteger(0, arrTitle.length - 1)
      const numRandomContent = getRndInteger(0, arrContent.length - 1)
      setState({
        message: {
          title: arrTitle[numRandomTitle],
          content: arrContent[numRandomContent],
        }
      })
    }, 10000)
    return () => {
      clearInterval(interval.current)
    }
  }, [])

  return (
    <div
      style={{
        marginTop: '1rem',
        padding: '0 0.5rem',
      }}
    >
      <Alert
        message={state.message?.title}
        description={state.message?.content}
        type='info'
        showIcon
        closable
        onClose={() => clearInterval(interval.current)}
      />
    </div>
  )
})

const getRndInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min) ) + min
}

const arrTitle = [
  'Có thể bạn chưa biết',
  'Có thể bạn đã biết',
  'Nhắc nhở',
  'Hình như bạn đã biết',
  'Hình như bạn chưa biết',
  'Bạn nên biết'
]
const arrContent = [
  'Khách hàng mua lợi ích: Thực chất, khách hàng không hề mua sản phẩm, họ mua những gì mà sản phẩm đó đem lại.',
  'Nên xác định rõ khách hàng mục tiêu, để bán hàng hiệu quả hơn.',
  'Lợi thế cạnh tranh của bạn là gì? xác định được lợi thế cạnh tranh, nắm bắt được những lợi ích đem lại, khách hàng sẽ vui vẻ rút ví và trả tiền cho bạn.',
  'Mạng xã hội là phương tiện rất tốt để tiếp cận khách hàng.',
  'Học hỏi những kỹ thuật đàm phán: Mục đích của đàm phấn là cùng tìm ra những giải pháp, cách làm giúp thỏa mãn cả người mua lẫn người bán.',
  'Nên trân trọng những khách hàng cũ: Khi bạn xây dựng được những mối quan hệ bền chặt, bạn sẽ có được lòng tin và sự trung thành của khách hàng, họ sẽ không bao giờ rời bỏ bạn để mua sản phẩm hoặc sử dụng dịch vụ của đối thủ.',
  'Cung cấp cho khách hàng những tin tức về sản phẩm mới: Nếu như bạn chuẩn bị cho ra mắt những dòng sản phẩm mới, đừng ngại ngần mà không quảng bá chúng cho khách hàng. Con người luôn có xu hướng tìm kiếm sự mới mẻ, và chắc chắn khách hàng sẽ sẵn sàng mua thêm nếu như sản phẩm mới của bạn tốt hơn cái cũ.',
  'Thông điệp bán hàng cần phải rõ ràng: Chọn một hoặc hai lợi ích tiêu biểu của sản phẩm. Chọn lựa từ ngữ thật đơn giản để đảm bảo rằng khách hàng hiểu được sản phẩm của bạn sẽ giúp ích được gì cho họ.',
  'Tận dụng những mối quan hệ xung quanh bạn: Làm việc với mạng lưới quan hệ cá nhân của bạn là một tùy chọn đôi khi bị bỏ qua, khá dễ dàng để bắt đầu vì bạn đã có sự tin tưởng. Có một số người bạn sẽ gặp trong bối cảnh nhất định mà bạn sẽ không nghĩ là một cỗ máy tạo ra khách hàng tiềm năng nhưng có thể trường hợp này hoàn toàn có thể xảy ra.',
  'Viết blog tìm kiếm khách hàng: Bạn đã bắt đầu viết blog chưa? Nếu chưa thì đây chính là lúc để bắt đầu. Bắt đầu bằng cách viết về những gì bạn hiểu rõ nhất.',
  'Nên xem xét  việc đặt hàng điện thoại di động',
  'Giao tiếp, giao tiếp, giao tiếp là chìa khóa bán hàng thành công',
  'Hãy chân thật với khách hàng, bạn sẽ có niềm tin từ họ',
  'Lấy khách hàng làm trung tâm cho kinh doanh của bạn',
  'Nhận ra rằng việc tăng doanh số không phải là một điều duy nhất',
  'Thuê và phát triển nhân viên để cung cấp dịch vụ khách hàng đặc biệt',
  'Nên tạo chiến lược giảm giá để quảng cáo, thu hút khách hàng',
  'Hãy quan tâm đến khách hàng cũ, họ là một nguồn doanh thu cố định quan trọng'
]