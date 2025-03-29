import dayjs from 'dayjs'
export const handleShowMenu = (path) => {
  const MenuList = ['/video/edit', '/login']
  if (MenuList.find((item) => path.includes(item))) {
    return true
  } else {
    return false
  }
}

export const wait = (time = 0) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time * 1000)
  })
}

export const localUrl = {
  addFileProtocol(url) {
    if(url && !url.startsWith('file:')){
      return `file://${url}`.replaceAll('\\', "\/")
    }
    return url
  },

  delFileProtocol(url) {
    return url && url.replace('file://', '')
  }
}


export const formatDate = (time = new Date(), pattern = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(time).format(pattern)
}

export const millisecondsToTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const remainingSecondsAfterHours = totalSeconds % 3600;
  const minutes = Math.floor(remainingSecondsAfterHours / 60);
  const seconds = remainingSecondsAfterHours % 60;
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

export const getUniqueId = () => {
  return Date.now() + Math.random().toString(36).substring(2, 15)
}
