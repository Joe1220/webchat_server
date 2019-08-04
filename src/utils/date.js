import moment from 'moment'

// 현재 날자로부터 12개월 전
export const getLastTwelveMonth = () => {
  return moment().subtract(12, 'month')
}

// 지난 12개월동안 달의 목록
export const getLastTwelveMonths = (format = 'YYYY-MM-01') => {
  let result = []
  let startDate = getLastTwelveMonth()

  while (startDate.isBefore(moment())) {
    result.push(startDate.format(format))
    startDate.add(1, 'month')
  }
  return result
}

// 최종적으로 지난 12개월동안 가입한 유저 목록을 출력
export const getUserListFromMonths = users => {
  const dateFormat = 'YY.MM'
  const months = getLastTwelveMonths(dateFormat) // 지난 12개월 달들의 목록
  // 각 달들의 key값으로 배열 생성. 최초값 0
  let result = months.map(month => {
    return { key: month, value: 0 }
  })
  // 유저 생성날짜와 달이 같을 경우 value 값 증가
  users.forEach(user => {
    const userCreatedAt = moment(user.createdAt).format(dateFormat)
    const current = result.find(month => month.key === userCreatedAt)
    current.value += 1
  })
  return result
}
