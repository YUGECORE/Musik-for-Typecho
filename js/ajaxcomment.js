var
   htm_1  = '<div class="ajaxcomment_loading" id="loading"><\/div><div class="ajaxcomment_success" id="success"><i class="fa-warning fa widget-fa"></i>&nbsp;�ύ�ɹ�.</div><div class="ajaxcomment_warning" id="error"><i class="fa-warning fa widget-fa"></i>&nbsp;<span id="msg"><\/span><\/div>',
   htm_3  = '<textarea name="ajaxComment" class="comm_area" cols="100%" rows="4"><\/textarea>',
   txt_1  = '������д�û���',
   txt_2  = '������д���������ַ',
   txt_3  = '�����ַ���Ϸ�',
   txt_4  = '������д��������',
   txt_5  = 'Spam Detected!';
jQuery(document).ready(function($) {
   $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
var
   comments_order = 'DESC',
   comment_list   = '.comment-list',
   comments       = '#comments h3',
   comment_reply  = '.reply',
   comment_form   = '#comment-form',
   respond        = '#comments',
   textarea       = '.textarea',
   submit_btn     = '.submit',

   new_id = '', parent_id = '';
   $(textarea).after(htm_1, htm_3);
   $msg = $('#msg');

click_bind();

$(comment_form).submit(function() { // �ύ
   $msg.empty();
   $(submit_btn).attr('disabled', true).fadeTo('slow', 0.5);

 /* Ԥ�� */
 if($(comment_form).find('#author')[0]) {

   if($(comment_form).find('#author').val() == '') {
     $msg.text(txt_1);
     msg_effect('#error'); return false;
   }

   if($(comment_form).find('#mail').val() == '') {
     $msg.text(txt_2);
     msg_effect('#error'); return false;
   }

   var filter = /^[^@\s<&>]+@([a-z0-9]+\.)+[a-z]{2,4}$/i;
   if(!filter.test($(comment_form).find('#mail').val())) {
     $msg.text(txt_3);
     msg_effect('#error'); return false;
   }

   if($(comment_form).find('.comm_area').val() != '') {
     $msg.text(txt_5);
     $('#error').slideDown(); return false;
   }

 }

 if($(comment_form).find(textarea).val() == '') {
   $msg.text(txt_4);
   msg_effect('#error'); return false;
 }

 $('#loading').show();
 $.ajax({
   url:  $(this).attr('action'),
   type: $(this).attr('method'),
   data: $(this).serializeArray(),
   error:function(){
	 $msg.text('�ύʧ��,������!');
	 msg_effect('#error'); 
     return false;
   },
   success: function(data) {
    $('#loading').slideUp();
    try {
       if (!$(comment_list, data).length) {
           $msg.text('�ύʧ��,������!');
           msg_effect('#error'); 
		   return false;
       } else {
         new_id = $(comment_list, data).html().match(/id=\"?comment-\d+/g).join().match(/\d+/g).sort(function(a,b){return a-b}).pop(); // ���� id
         data = $('#li-comment-' + new_id, data).hide(); // ȡ������
         msg_effect("#success");
		 if(parent_id){
			if($('#' + parent_id).find(".comment-children").length<=0){
				$('#' + parent_id).append("<div class='comment-children'><ol class='comment-list'></ol></div>");
			}
			$('#' + parent_id+" .comment-children .comment-list").prepend(data);
			parent_id='';
		 }else{
			if (!$(comment_list).length) $(respond).append('<h3 class="widget-title"><i class="fa-comments fa widget-fa"></i>&nbsp;0 ������</h3><ol class="comment-list"><\/ol>'); // �� ol
			$(comment_list).prepend(data);
		 }
         $('#li-comment-' + new_id).fadeIn(); // ��ʾ
         $(comments).length ? (n = parseInt($(comments).text().match(/\d+/)), $(comments).html($(comments).html().replace(n, n + 1))) : 0; // ������

         TypechoComment.cancelReply();
         $(textarea).val('');
         $(comment_reply + ' b, #cancel-comment-reply-link').unbind('click'); click_bind(); // �����۰�
         $(submit_btn).attr('disabled', false).fadeTo('slow', 1);
         $body.animate({scrollTop: $('#li-comment-' + new_id).offset().top - 200}, 500);
       }
    } catch (e) {
         alert('Error!\n\n' + e);
		 window.location.reload();
    }
   } // end success()
 }); // end ajax()
 return false; 
}); // end $(comment_form).submit()

function click_bind() { // ��
  $(comment_reply + ' b').click(function() { // �ظ�
      //$body.animate({scrollTop: $(respond).offset().top - 180}, 400);
      parent_id = "li-"+$(this).attr("id");
      $(textarea).focus();
  });
  $('#cancel-comment-reply-link').click(function() { // ȡ��
     parent_id = '';
  });	
}

function msg_effect(id) { // ����
  $(id).slideDown();
  setTimeout(function() {$(submit_btn).attr('disabled', false).fadeTo('', 1); $(id).slideUp();}, 3000);
}

}); 