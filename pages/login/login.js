$(function () {

  $('.login>div>button').on('click', function () {
    // jQuery提供的选择器  :type的值, 相当于 [type=text]
    var phone = $('.login>div>:text').val()
    var pwd = $('.login>div>:password').val()

    var url = 'https://serverms.xin88.top/users/login'

    $.post(url, { phone, pwd }, data => {
      console.log('登录结果:', data)
      // 账号: 16565496789  密码:123456
      if (data.code == 200) {
        alert("登录成功! 即将回到首页")

        // 根据 下次自动登录 的勾选框状态, 选择 长期 还是 短期存储
        // :checkbox 由jQuery提供, 相当于 [type=checkbox]
        const chb = $('.login :checkbox').prop('checked')
        // 用户数据是对象类型, 要转JSON字符串才能存储
        const user = JSON.stringify(data.data)

        chb ? localStorage.setItem('user', user) : sessionStorage.setItem('user', user)

        location.replace('?p=home')
      } else {
        alert(data.msg)
      }
    })
  })
})