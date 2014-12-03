
#Slideshow theme specific

from Products.Five import BrowserView
import json
from zope.component import getMultiAdapter

class get_slideshow_options(BrowserView):
	"""
	AJAX call to get slideshow options
	"""
	def getJSON(self):
		callback = hasattr(self.request, 'callback') and 'json' + self.request['callback'] or None
		only_documented = not hasattr(self.request, 'only_documented') 
		
		state = getMultiAdapter(
                (self.context, self.request),
                name=u'plone_context_state')


		# Check view type
		view_type = state.view_template_id()
		print view_type

		if view_type == "double_view":
			options = {
				'changes': True,
				'slidesToShow': 2,
				'arrows':False,
				'height':'480px',
				'type': 'double'
			}
		elif view_type == "multiple_view":
			options = {
				'changes': True,
				'autoplay': True,
				'autoplaySpeed': 500,
				'type': 'multiple',
				'arrows': False
			}
		else:
			options = {
				'changes': False
			}

		json_str = json.dumps(options)

		if callback is not None:
			return callback +'(' + json_str + ')'
		else:
			return json_str

