export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMillis = now.getTime() - date.getTime();

  const millisInSecond = 1000;
  const millisInMinute = millisInSecond * 60;
  const millisInHour = millisInMinute * 60;
  const millisInDay = millisInHour * 24;
  const millisInMonth = millisInDay * 30; // 간단한 계산으로 사용하며 정확하지 않을 수 있습니다.
  const millisInYear = millisInDay * 365; // 간단한 계산으로 사용하며 정확하지 않을 수 있습니다.

  if (diffMillis < millisInMinute) {
    return "방금 전";
  } else if (diffMillis < millisInHour) {
    const minutes = Math.floor(diffMillis / millisInMinute);
    return `${minutes}분 전`;
  } else if (diffMillis < millisInDay) {
    const hours = Math.floor(diffMillis / millisInHour);
    return `${hours}시간 전`;
  } else if (diffMillis < millisInMonth) {
    const days = Math.floor(diffMillis / millisInDay);
    return `${days}일 전`;
  } else if (diffMillis < millisInYear) {
    const months = Math.floor(diffMillis / millisInMonth);
    return `${months}개월 전`;
  } else {
    const years = Math.floor(diffMillis / millisInYear);
    return `${years}년 전`;
  }
};
