
#Slideshow theme specific

from Products.Five import BrowserView
import json
from zope.component import getMultiAdapter
from Products.CMFCore.utils import getToolByName
from collective.leadmedia.interfaces import ICanContainMedia
from zope.schema import getFieldsInOrder
from Products.mediaObject.object import IObject
from plone.dexterity.interfaces import IDexterityFTI
from zope.component import getUtility
from Products.CMFCore.utils import getToolByName

class get_nav_objects(BrowserView):
	"""
	Utils
	"""
	def get_object_idx(self, results, object_id, is_folder):
		if is_folder:
		 	for idx, res in enumerate(results):
				if res.getId == object_id:
					return idx
		else:
			for idx, res in enumerate(results):
				if res.getId() == object_id:
					return idx

	def get_all_batch(self, collection_object, is_folder):
		catalog = getToolByName(self.context, 'portal_catalog')

		if is_folder:
			collection_obj = collection_object
		else:
			collection_obj = collection_object.getObject()
		if is_folder:
			folder_path = '/'.join(collection_obj.getPhysicalPath())
			results = catalog(path={'query': folder_path, 'depth': 1, 'portal_type':'Object'})
		else:
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
			"object_idx":0,
			'total':False
		}

		results = self.get_all_batch(collection_object, False)
		object_idx = self.get_object_idx(results, self.context.getId())
		items['object_idx'] = object_idx

		for obj in results:
			if obj != None:
				obj_media = ICanContainMedia(obj.getObject()).getLeadMedia()
				if obj_media != None:
					items['list'].append({'url':obj.getURL(),'image_url': obj_media.absolute_url()+'/@@images/image/large', 'object_id': obj.getId(), 'title':obj.Title(), 'description': obj.Description(), 'body': ""})

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

	def get_multiple_images(self, _object, view_type):
		images = []
		
		if view_type == 'double_view':
			limit = 2
			curr = 0
			if hasattr(_object, 'slideshow'):
				slideshow = _object['slideshow']
				if slideshow.portal_type == "Folder":
					for img in slideshow:
						curr += 1 
						if slideshow[img].portal_type == 'Image':
							images.append(slideshow[img].absolute_url()+'/@@images/image/large')
						if curr >= limit:
							break

		elif view_type == 'multiple_view':
			if hasattr(_object, 'slideshow'):
				slideshow = _object['slideshow']
				if slideshow.portal_type == "Folder":
					for img in slideshow:
						if slideshow[img].portal_type == 'Image':
							images.append(slideshow[img].absolute_url()+'/@@images/image/large')

		return images

	def get_all_fields_object(self, object):
		object_schema = {}
		schema = getUtility(IDexterityFTI, name='Object').lookupSchema()
		for name, field in getFieldsInOrder(schema):
			if name not in ["text", "title"]:
				value = getattr(object, name)
				if value != None and value != '':
					if name in ['technique', 'artist', 'material', 'object_type']:
						_value = '<a href="search?SearchableText=%s">%s</a>' % (value, value)
						value = _value
					object_schema[field.title] = value

		return object_schema

	def build_json_with_list(self, list_items, object_idx, total, is_folder):
		items = {
			'list':[],
			'object_idx':object_idx,
			'total': total,
			'has_list_images':False,
			'view_type': 'regular'
		}

		state = getMultiAdapter(
				(self.context, self.request),
				name=u'plone_context_state')

		# Check view type
		view_type = state.view_template_id()

		if view_type == "double_view" or view_type == "multiple_view":
			items["has_list_images"] = True
			items["view_type"] = view_type

		if is_folder:
			for obj in list_items:
				obj_media = ICanContainMedia(obj.getObject()).getLeadMedia()
				if obj_media != None:
					schema = self.get_all_fields_object(obj.getObject())
					if not items['has_list_images']:
						items['list'].append({'schema':schema, 'url':obj.getURL(),'image_url': obj_media.absolute_url()+'/@@images/image/large', 'object_id': obj.getId, 'title':obj.Title, 'description': obj.Description, 'body': self.get_object_body(obj)})
					else:
						items['list'].append({'schema':schema, 'images':self.get_multiple_images(obj.getObject(), view_type), 'url':obj.getURL(),'image_url': obj_media.absolute_url()+'/@@images/image/large', 'object_id': obj.getId, 'title':obj.Title, 'description': obj.Description, 'body': self.get_object_body(obj)})				
		else:
			for obj in list_items:
				obj_media = ICanContainMedia(obj.getObject()).getLeadMedia()
				if obj_media != None:
					schema = self.get_all_fields_object(obj.getObject())
					if not items['has_list_images']:
						items['list'].append({'schema':schema, 'url':obj.getURL(),'image_url': obj_media.absolute_url()+'/@@images/image/large', 'object_id': obj.getId(), 'title':obj.Title(), 'description': obj.Description(), 'body': self.get_object_body(obj)})
					else:
						items['list'].append({'schema':schema, 'images':self.get_multiple_images(obj.getObject(), view_type), 'url':obj.getURL(),'image_url': obj_media.absolute_url()+'/@@images/image/large', 'object_id': obj.getId(), 'title':obj.Title(), 'description': obj.Description(), 'body': self.get_object_body(obj)})				
		return items

	"""
	Get bulk of prev items
	"""
	def get_prev_objects(self):
		bulk = 30
		b_start = self.request.get('b_start')
		collection_id = self.request.get('collection_id')
		object_id = self.request.get('object_id')

		if b_start != None and collection_id != None and object_id != None:
			collection_object = self.get_collection_from_catalog(collection_id)
			results = self.get_all_batch(collection_object, False)
			object_idx = self.get_object_idx(results, object_id)

			if object_idx-bulk >= 0:
				list_of_items = list(results)
				bulk_of_items = list_of_items[(object_idx-bulk):object_idx]
				items = self.build_json_with_list(bulk_of_items, 0, False, False)
				items['list'] = list(reversed(items['list']))
				return json.dumps(items)

		return json.dumps({'list':[], 'object_idx':0})

	"""
	Get bulk of next items
	"""
	def get_next_objects(self):
		bulk = 30
		b_start = self.request.get('b_start')
		collection_id = self.request.get('collection_id')
		object_id = self.request.get('object_id')
		is_collection = False
		is_folder = False
		if b_start != None and collection_id != None:
			is_collection = True
		else:
			if self.context.getParentNode() != None:
				parent = self.context.getParentNode();
				if parent.portal_type == 'Folder':
					is_folder = True

		if not (is_folder == False and is_collection == False) and object_id != None:
			if is_collection:
				collection_object = self.get_collection_from_catalog(collection_id)
			else:
				collection_object = parent

			results = self.get_all_batch(collection_object, is_folder)
			object_idx = self.get_object_idx(results, object_id, is_folder)

			if object_idx+bulk < len(results):
				list_of_items = list(results)
				bulk_of_items = list_of_items[(object_idx+1):(object_idx+bulk+1)]
				items = self.build_json_with_list(bulk_of_items, 0, False, is_folder)
				return json.dumps(items)
			
			elif object_idx+bulk >= len(results):
				list_of_items = list(results)
				offset = (object_idx+bulk) - len(results)
				bulk_of_items = list_of_items[(object_idx+1):] + list_of_items[0:(offset+1)]
				items = self.build_json_with_list(bulk_of_items, 0, True, is_folder)
				return json.dumps(items)

		return json.dumps({'list':[], 'object_idx':0, 'total':False})

	def get_object_body(self, object):
		if hasattr(object, 'text') and object.text != None:
			return object.text.output
		else:
			return ""

	def getJSON(self):
		pagesize = 33
		buffer_size = 30
		b_start = self.request.get('b_start')
		collection_id = self.request.get('collection_id')

		is_folder = False
		is_collection = False

		items = {
			'list':[],
			'object_idx':0,
			'total':False
		}

		if b_start != None and collection_id != None:
			is_collection = True
		else:
			if self.context.getParentNode() != None:
				parent = self.context.getParentNode();
				if parent.portal_type == 'Folder':
					is_folder = True

		if not (is_folder == False and is_collection == False): 
			if is_collection:
				collection_object = self.get_collection_from_catalog(collection_id)
			else:
				collection_object = parent

			current_id = self.context.getId()

			results = self.get_all_batch(collection_object, is_folder)
			object_idx = self.get_object_idx(results, current_id, is_folder)

			if object_idx-buffer_size >= 0 and object_idx+buffer_size < len(results):
				list_of_items = list(results)
				
				prev_items = list_of_items[(object_idx-buffer_size):object_idx]
				next_items = list_of_items[object_idx:(object_idx+buffer_size+1)]

				bulk_of_items = next_items + prev_items
				
				items = self.build_json_with_list(bulk_of_items, 0, False, is_folder)
				return json.dumps(items)
			
			elif object_idx-buffer_size < 0 and object_idx+buffer_size < len(results):
				#fetch from last page
				offset = object_idx-buffer_size
				
				list_of_items = list(results)
				prev_items = list_of_items[offset:] + list_of_items[0:object_idx]
				next_items = list_of_items[object_idx:(object_idx+buffer_size+1)]

				bulk_of_items = next_items + prev_items
				
				items = self.build_json_with_list(bulk_of_items, 0, False, is_folder)
				return json.dumps(items)

			elif object_idx+buffer_size >= len(results) and object_idx-buffer_size > 0:
				list_of_items = list(results)

				offset = (object_idx+buffer_size) - len(results)

				prev_items = list_of_items[(object_idx-buffer_size):object_idx]
				next_items = list_of_items[object_idx:] + list_of_items[0:(offset+1)]

				bulk_of_items = next_items + prev_items
				items = self.build_json_with_list(bulk_of_items, 0, False)
				return json.dumps(items)

			elif object_idx+buffer_size >= len(results) and object_idx-buffer_size < 0:
				list_of_items = list(results)

				prev_items = list_of_items[0:object_idx]
				next_items = list_of_items[object_idx:]

				bulk_of_items = next_items + prev_items
				items = self.build_json_with_list(bulk_of_items, 0, True, is_folder)
				return json.dumps(items)
		else:
			return json.dumps(items);



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



