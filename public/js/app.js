

(function() {
	$(function() {
		$('.build').on('click', function() {
			var data = {
				id: $(this).attr('id')
			};

			$.ajax({
				url: '/run',
				type: 'POST',
				data: data
			});

			
			setInterval(function() {
				$.ajax({
					url: '/output/' + data.id,
					type: 'GET',
					success: function(data) {
						console.log(data);
						
						$('.output').html(data.output);
					}
				});				
			}, 500);
		});
	});	
})()
