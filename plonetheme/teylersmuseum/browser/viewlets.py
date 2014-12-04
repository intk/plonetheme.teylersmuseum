# Viewlets

from plone.app.layout.nextprevious.view import NextPreviousViewlet
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile

class nextPreviousViewlet(NextPreviousViewlet):
	render = ViewPageTemplateFile("templates/nextprevious.pt")
	