#! /bin/bash
#
# Run this script from the project folder to serve the website on http://localhost:4000
#
# https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/testing-your-github-pages-site-locally-with-jekyll

cd `dirname "$0"`

# load ruby
source /usr/local/opt/chruby/share/chruby/chruby.sh
source /usr/local/opt/chruby/share/chruby/auto.sh
chruby ruby-3.1.3

# install jekyll
gem install jekyll

# create Gemfile
cat > Gemfile <<'eof'
source 'https://rubygems.org'
gem 'nokogiri'
gem 'rack', '~> 2.2.4'
gem 'rspec'
gem 'jekyll'
gem 'jekyll-paginate'
gem 'jekyll-sitemap'
gem 'jekyll-gist'
gem 'jekyll-feed'
gem 'jekyll-include-cache'
eof

bundle install
# git add Gemfile Gemfile.lock

# start the server
bundle exec jekyll serve

# Or tracing mode
# bundle exec jekyll serve --trace

# You can now open http://localhost:4000
