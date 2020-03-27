$(function () {
  function buildHTML(message) {
    var html = `
    <div class="mycomment" data-message-id=${message.id}>
    <p>
    ${message.content}
    </p>
    </div> `
    return html;
  }
  $('#new_message').on('submit', function (e) {
    e.preventDefault()
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
      .done(function (data) {
        var html = buildHTML(data);
        $('.line-bc').append(html);
        $('.form__text').val('');
        $('.form__submit').prop('disabled', false);
        $('.line-bc').animate({ scrollTop: $('.line-bc')[0].scrollHeight });
        for (let value of formData.entries()) {
          console.log(value);
        }

      })
      .fail(function () {
        alert('error');
      })
  });
  var reloadMessages = function () {
    //カスタムデータ属性を利用し、ブラウザに表示されている最新メッセージのidを取得
    var last_message_id = $('.message:last').data("message-id");
    $.ajax({
      //ルーティングで設定した通り/groups/id番号/api/messagesとなるよう文字列を書く
      url: "api/messages",
      //ルーティングで設定した通りhttpメソッドをgetに指定
      type: 'get',
      dataType: 'json',
      //dataオプションでリクエストに値を含める
      data: { id: last_message_id }
    })

      .done(function (messages) {
        console.log('success');
      })
      .fail(function () {
        alert('error');
      });
  };
  // setInterval(reloadMessages, 7000);

});