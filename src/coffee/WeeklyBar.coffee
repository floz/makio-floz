class WeeklyBar

	_$ul: null
	_$li: null

	constructor: ->
		@_$ul = $( "#weekly_bar ul" )
		@_$li = $( "#weekly_bar li" )
		@_$li.css "display", "block"
		@_organize()
		$( window ).resize @_resizeHandler

	_organize: ->
		w = $( window ).width()
		h = $( window ).height()

		@_$ul.width w

		wLi = w / @_$li.length
		px = 0

		for li in @_$li
			$li = $( li )
			$li.css
				"width": wLi + "px"
				"left": px + "px"
			$img = $li.find "img"
			if $img.width() < wLi
				$img.css "width", wLi + "px"
			$img.css
				"position": "absolute"
				"left": wLi - $img.width() >> 1
			px += wLi

	_resizeHandler: =>
		@_organize()

