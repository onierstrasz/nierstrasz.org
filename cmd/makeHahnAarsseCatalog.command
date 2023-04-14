#! /bin/sh
#
# Make an image catalog
#
# $repo/$img/full contains the full-sized images
# $repo/$img/small containts images scaled (short-edge) and cropped to 300x300

repo=/Users/oscar/Documents/Websites/nierstrasz.org
dir=/_pages/HahnAarsse
img=/assets/images/HahnAarsse
columns=5

cat=$repo/$dir/catalog.md

cat > $cat << 'eof'
---
title: "Hahn-Aarsse Photo Catalog"
permalink: /HahnAarsse/catalog
sidebar:
  nav: "hahn-aarsse"
---

||||||
| --- | --- | --- | --- | --- |
eof

count=0

cd $repo/$img

for path in `find full -name \*.jpg | sort`
do
	count=`expr 1 + $count`
	file=`basename $path`
	base=`basename $file .jpg`
	/bin/echo -n "|[![$base]($img/small/$file)]($img/full/$file)" >> $cat
	case $count in
		$columns ) count=0
				/bin/echo "|" >> $cat
				;;
	esac
done

/bin/echo "|" >> $cat

open $cat
