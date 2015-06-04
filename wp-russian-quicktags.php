<?php
/*
Plugin Name: WP Russian Quicktags
Plugin URI: http://www.wordpressplugins.ru/komments/wp-comment-quicktags-plus.html
Description: Плагин выводит симпатичную панель с кнопками форматирования текста в комментариях и ссылку на "Цитировать". Подробно об установке и настройке этого плагина вы можете прочитать на <a href="http://www.wordpressplugins.ru/komments/wp-comment-quicktags-plus.html">странице</a> плагина.
Version: 1.04
Author: Flector
Author URI: https://profiles.wordpress.org/flector#content-plugins
*/ 

function wrq_change_comment_form_defaults($default) {
  $commenter = wp_get_current_commenter();
  $purl = plugins_url(); 
  $url = $purl . '/wp-russian-quicktags/scripts.js'; 
  $oldcommentfield = $default['comment_field'];
  $default['comment_field'] = str_replace(
            '<textarea',
            '<div id="comment_quicktags">
			<script src="'.$url.'" type="text/javascript"></script>
			<script type="text/javascript">edToolbar();</script>
		</div><textarea',$oldcommentfield) ;
  return $default; }
add_filter('comment_form_defaults', 'wrq_change_comment_form_defaults',99999); 

function wrq_stylesheet() {
	$purl = plugins_url(); 
    $myStyleUrl = $purl . '/wp-russian-quicktags/style.css';
    wp_register_style('wp-russian-quicktags', $myStyleUrl);
    wp_enqueue_style( 'wp-russian-quicktags');
}
add_action('wp_print_styles', 'wrq_stylesheet');
	
function wp_russian_quicktags_define_textfield() {	
	echo '
		<script type="text/javascript">
		<!--
		edCanvas = document.getElementById(\'comment\');
		//-->
		</script>
		'; }
add_action('comment_form', 'wp_russian_quicktags_define_textfield');
	
function wp_russian_quicktags() {
	$purl = plugins_url();
	?>
	<div id="comment_quicktags">
	<script src="<?php echo $purl . '/wp-russian-quicktags/scripts.js'; ?>" type="text/javascript"></script>
	<script type="text/javascript">edToolbar();</script>
	</div>
<?php } ?>