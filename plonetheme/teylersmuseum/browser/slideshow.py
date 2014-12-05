
#Slideshow theme specific

from Products.Five import BrowserView
import json
from zope.component import getMultiAdapter
from Products.CMFCore.utils import getToolByName
from collective.leadmedia.interfaces import ICanContainMedia

class get_nav_objects(BrowserView):
	"""
	Utils
	"""
	def get_object_idx(self, results, object_id):
		 for idx, res in enumerate(results):
			if res.getId() == object_id:
				return idx

	def get_all_batch(self, collection_object):
		collection_obj = collection_object.getObject()
		results = collection_obj.queryCatalog(batch=False, sort_on='sortable_title')
		return results

	def get_batch(self, collection_object, start, pagesize=33):
		collection_obj = collection_object.getObject()
		results = collection_obj.queryCatalog(batch=True, b_start=int(start), sort_on='sortable_title', b_size=pagesize)
		return results

	"""
	Get prev obj
	"""
	def get_prev_obj(self, start, collection_id):
		pagesize = 33
		
		if "/" not in start:
			object_id = self.context.getId()
			catalog = getToolByName(self.context, 'portal_catalog')
			search_results = catalog.searchResults({'UID':collection_id})

			if len(search_results) > 0:
				collection_object = search_results[0]
				if collection_object.portal_type == "Collection":
					## Get Batch of collection
					results = self.get_batch(collection_object, start, pagesize)
					
					## Get prev item
					object_idx = self.get_object_idx(results, object_id)                    
					if object_idx > 0:
						return results[object_idx-1]
					else:
						if results.has_previous:
							page = results.previouspage
							start = int(start)
							start = (page * pagesize) - pagesize
							b_results = self.get_batch(collection_object, start, pagesize)
							last_element = b_results[b_results.items_on_page-1]
							return last_element
						else:
							lastpage = results.lastpage
							start = int(start)
							start = (lastpage * pagesize) - pagesize
							b_results = self.get_batch(collection_object, start, pagesize)
							last_element = b_results[b_results.items_on_page-1]
							return last_element
	"""
	Get next obj
	"""
	def get_next_obj(self, start, collection_id):
		pagesize = 33

		if "/" not in start:
			object_id = self.context.getId()
			catalog = getToolByName(self.context, 'portal_catalog')
			search_results = catalog.searchResults({'UID':collection_id})

			if len(search_results) > 0:
				collection_object = search_results[0]
				if collection_object.portal_type == "Collection":
					results = self.get_batch(collection_object, start, pagesize)
					object_idx = self.get_object_idx(results, object_id)
					if object_idx < results.items_on_page-1:
						return results[object_idx+1]
					else:
						if results.has_next:
							page = results.nextpage
							page -= 1
							start = int(start)
							start = (page * pagesize)
							b_results = self.get_batch(collection_object, start, pagesize)
							first_element = b_results[0]
							return first_element
						else:
							start = 0
							b_results = self.get_batch(collection_object, start, pagesize)
							first_element = b_results[0]
							return first_element

	def get_collection_from_catalog(self, collection_id):
		catalog = getToolByName(self.context, 'portal_catalog')
		search_results = catalog.searchResults({'UID':collection_id})
		if len(search_results) > 0:
			collection_object = search_results[0]
			if collection_object.portal_type == "Collection":
				return collection_object

		return None

	def get_all_items_from_collection(self, collection_object):
		items = {
			"list":[],
			"object_idx":0
		}

		results = self.get_all_batch(collection_object)
		object_idx = self.get_object_idx(results, self.context.getId())
		items['object_idx'] = object_idx

		for obj in results:
			if obj != None:
				obj_media = ICanContainMedia(obj.getObject()).getLeadMedia()
				if obj_media != None:
					items['list'].append({'url':obj.getURL(),'image_url': obj_media.absolute_url()+'/@@images/image/large', 'object_id': obj.getId(), 'title':obj.Title(), 'description': obj.Description(), 'body': obj.text.output})

		return items

	"""
	AJAX to get all items inside collection
	"""
	def get_all_collection(self):
		collection_id = self.request.get('collection_id')
		items = []
		
		if collection_id != None:
			collection_object = self.get_collection_from_catalog(collection_id)
			if collection_object != None:
				## Get Batch of collection
				items = self.get_all_items_from_collection(collection_object)

		return json.dumps(items)

	def getJSON(self):
		pagesize = 33
		buffer_size = 5
		b_start = self.request.get('b_start')
		collection_id = self.request.get('collection_id')

		if b_start != None and collection_id != None:
			items = {
				'list':[],
				'object_idx':5
			}

			collection_object = self.get_collection_from_catalog(collection_id)
			current_id = self.context.getId()

			_previous = []
			_next = []

			results = self.get_all_batch(collection_object)
			object_idx = self.get_object_idx(results, current_id)

			if object_idx-buffer_size >= 0 and object_idx+buffer_size < len(results):
				list_of_items = list(results)
				_buffer = list_of_items[(object_idx-buffer_size):(object_idx+buffer_size+1)]
				
				for obj in _buffer:
					obj_media = ICanContainMedia(obj.getObject()).getLeadMedia()
					if obj_media != None:
						items['list'].append({'url':obj.getURL(),'image_url': obj_media.absolute_url()+'/@@images/image/large', 'object_id': obj.getId(), 'title':obj.Title(), 'description': obj.Description(), 'body': obj.text.output})

				return json.dumps(items)
			
			elif object_idx-buffer_size < 0 and object_idx+buffer_size < len(results):
				#fetch from last page
				offset = object_idx-buffer_size
				
				list_of_items = list(results)
				prev_items = list_of_items[offset:]
				next_items = list_of_items[0:(object_idx+buffer_size+1)]

				_buffer = prev_items + next_items
				
				for obj in _buffer:
					obj_media = ICanContainMedia(obj.getObject()).getLeadMedia()
					if obj_media != None:
						items['list'].append({'url':obj.getURL(),'image_url': obj_media.absolute_url()+'/@@images/image/large', 'object_id': obj.getId(), 'title':obj.Title(), 'description': obj.Description(), 'body': obj.text.output})

				return json.dumps(items)

			elif object_idx+buffer_size >= len(results) and object_idx-buffer_size > 0:
				list_of_items = list(results)

				offset = len(results) - (object_idx+buffer_size+1)
				lisf_of_items = list(results)

				prev_items = list_of_items[(object_idx-buffer_size):]
				next_items = list_of_items[0:(abs(offset)+buffer_size+1)]

				_buffer = prev_items + next_items
				for obj in _buffer:
					obj_media = ICanContainMedia(obj.getObject()).getLeadMedia()
					if obj_media != None:
						items['list'].append({'url':obj.getURL(), 'image_url': obj_media.absolute_url()+'/@@images/image/large', 'object_id': obj.getId(), 'title':obj.Title(), 'description': obj.Description(), 'body': obj.text.output})

				return json.dumps(items)




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



