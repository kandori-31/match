$(function () {
  function buildHTML(message) {
    var html = `<div class="mycomment">
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

      })
      .fail(function () {
        alert('error');
      })
  });
});