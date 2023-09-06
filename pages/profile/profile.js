$(function () {
  const user = JSON.parse(
    sessionStorage.getItem('user') || localStorage.getItem('user')
  )

  // 头像设定:
  if (user.avatar) {
    $('.profile #photo>img').prop('src', user.avatar)
  }

  $('.profile td#phone').text(user.phone)
  $('.profile td#created').text(
    moment(user.created).format('YYYY-MM-DD HH:mm:ss')
  )


  $('.profile>.left').on('click', 'li', function () {
    // $(this).addClass('active').siblings().removeClass('active')

    // 左侧的标签序号 和 右侧的内容序号 必须人为确保一致
    const i = $(this).index() //当前点击项目的序号

    // 同时把选中的序号 存储在地址栏中
    location.assign('?p=profile&index=' + i)

    // 通过序号 找到其对应的内容元素
    // $('.profile>.right>div').eq(i).show().siblings().hide()
  })

  // 初始化时, 阅读路径中的参数 index, 来决定激活哪一项
  const index = new URLSearchParams(location.search).get('index')
  $('.profile>.left>ul>li').eq(index)
    .addClass('active').siblings().removeClass('active')

  $('.profile>.right>div').eq(index).show().siblings().hide()

  // 退出:
  $('.profile  button.logout').click(function () {
    sessionStorage.removeItem('user')
    localStorage.removeItem('user')

    location.replace('?p=home')
  })

  // 我的头像
  $.get('https://serverms.xin88.top/users/head_photos', data => {
    console.log('头像数据:', data)

    $('.profile #photo>div').html(
      data.hero.map(value => {
        const { alias, selectAudio } = value

        return `<img data-au="${selectAudio}" src="https://game.gtimg.cn/images/lol/act/img/champion/${alias}.png" alt="">`
      })
    )
  })

  // 为头像选项加点击
  $('.profile #photo>div').on('click', 'img', function () {
    const src = $(this).prop('src')

    $('.profile #photo>img').prop('src', src)

    const au = $(this).data('au') // data-au
    audio.src = au
    // audio.play()
  })

  const audio = document.createElement('audio')

  // 确定: 上传当前选中的头像
  $('.profile #photo>button').click(function () {
    var url = 'https://serverms.xin88.top/users/head_photo'

    const id = user.id
    const alias = $('.profile #photo>img').prop('src')
    console.log({ alias });
    $.post(url, { id, alias }, data => {
      console.log('头像上传结果:', data)
      alert(data.msg)
      // 如果上传成功, 则立刻更新本地存储的用户信息
      if (data.code == 200) {
        user.avatar = alias // 修改用户的头像信息
        // 判断当前用户信息存储在 本地 还是 会话存储
        if (sessionStorage.getItem('user')) {
          sessionStorage.setItem('user', JSON.stringify(user))
        }
        if (localStorage.getItem('user')) {
          localStorage.setItem('user', JSON.stringify(user))
        }
        // 刷新页面
        location.reload()
      }
    })
  })
})