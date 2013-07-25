

(function() {
	$(function() {

		function terminalColors(str) {
			
			str = str.replace(/\[22m/g, '</span>');
			str = str.replace(/\[39m/g, '</span>');
			str = str.replace(/\[1m/g, '<span class="t_bold">');
			str = str.replace(/\[31m/g, '<span class="t_red">');
			str = str.replace(/\[32m/g, '<span class="t_green">');
			return str;
		}

		$('.build').on('click', function() {
			var data = {
				id: $(this).attr('id')
			};

			$('.status').html('pending').addClass('label').addClass('label-warning');

			$.ajax({
				url: '/run',
				type: 'POST',
				data: data,
				success: function(data) {
					var build_id = data.build_id;
					console.log(build_id);

					var interval = setInterval(function() {
						$.ajax({
							url: '/output/' + build_id,
							type: 'GET',
							success: function(data) {
								console.log(data);
								data.output = terminalColors(data.output);
								$('.output').html(data.output);
								if(data.status === 'complete') {
									if(data.build_status === 'passing') {
										$('.status').html('passing')
											.removeClass('label-warning')
											.addClass('label-success');
									} else if(data.build_status === 'failed') {
										$('.status').html('failed')
											.removeClass('label-warning')
											.addClass('label-important');
									}
									
									console.log('Complete')
									clearInterval(interval);
								}
							}
						});

					}, 500);		
				}
			});

			
			
		});
	});	
})()
