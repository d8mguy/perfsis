
# install should be run with sudo

execdir = /usr/local/bin
mdir = ${HOME}/Library/Application Support/D8m/Perfsis/modules/
bdir = $$PWD/build

perfsisMeasure:	perfsisMeasure.d8m pfsdtempl8.d8m
	d8mc perfsisMeasure.d8m

tests:	tests/testSpec.d8m ../webgen/modules/md2html.d8m ../webgen/modules/charthelp.d8m
	cd tests; webgen -port=8082 -deploy testSpec.d8m; d8mc testSpecSrvrPort8082.d8m; mv testSpecSrvrPort8082 build/

# note: I have torn my hair out over getting the local dir into perfsisShow. Make's quotation is too broken to create a shell script
# and sed isn't very cooperative either.
install:
	mkdir -p ${HOME}/Library/Application\ Support/D8m/Perfsis
	cp -p -r modules ${HOME}/Library/Application\ Support/D8m/Perfsis/
	cp -p pfsdtempl8.d8m ${HOME}/Library/Application\ Support/D8m/Perfsis/
	d8mc -addmod="perfsis,$(mdir)"
	webgen -port=8081 -deploy="$$PWD" pfsFESpec.d8m
	d8mc pfsFESpecSrvrPort8081.d8m
	mv pfsFESpecSrvrPort8081 $(execdir)/perfsisShow
	d8mc perfsisMeasure.d8m
	mv perfsisMeasure $(execdir)
