# -*- coding: utf-8 -*-
"""
.. module:: project.urls
   :synopsis: Project URLs

.. moduleauthor:: Mark Walker <mark.walker@realbuzz.com>
"""
from cms.sitemaps import CMSSitemap
from django.conf import settings
from django.conf.urls.i18n import i18n_patterns
from django.contrib import admin
from django.contrib.sitemaps.views import sitemap
from django.urls import re_path, path, include
from django.views.static import serve
from django.views.i18n import JavaScriptCatalog

sitemaps = {
    'sitemaps': {
        'cmspages': CMSSitemap,
    }
}
urlpatterns = [
    path('sitemap.xml', sitemap, sitemaps),
]

# This is only needed when using runserver.
# Load this before the other URLs to avoid CMS catching them all
if settings.DEBUG:
    urlpatterns += [
        re_path(r'^static/(?P<path>.*)$', serve),
        re_path(
            r'^media/(?P<path>.*)$', serve,
            {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}
        ),
    ]

    try:
        import debug_toolbar
        urlpatterns = [
            path('__debug__/', include(debug_toolbar.urls)),
        ] + urlpatterns
    except ImportError:
        pass


urlpatterns += i18n_patterns(

    path(
        'jsi18n/',
        JavaScriptCatalog.as_view(),
        name='javascript-catalog'
    ),
    path(
        'admin/',
        admin.site.urls
    ),
    re_path(r'^', include('cms.urls'))
)
