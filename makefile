npm = npm
npmInstallFlag= install 
npmEndFlag = --save

nodeJsLib = discord.js basic-auth uws ytdl-core youtube-dl

#-----------------------

wget = wget

cp = cp

unzip = unzip



nameOfSourceBrancheD = develop
nameOfSourceBrancheT = testBranch

nameOfSourceBranche = $(nameOfSourceBrancheD)

nameOfRepo = ChickenBot-V2
linkToRepoArchiveD = "https://github.com/asylamba/$(nameOfRepo)/archive/$(nameOfSourceBrancheD).zip"
linkToRepoArchiveT = "https://github.com/asylamba/$(nameOfRepo)/archive/$(nameOfSourceBrancheT).zip"


linkToRepoArchive = "https://github.com/asylamba/$(nameOfRepo)/archive/$(nameOfSourceBranche).zip"



nameOfSourceCodeArchive = $(nameOfSourceBranche).zip
nameOfSourceCodeArchiveT = $(nameOfSourceBrancheT).zip
nameOfSourceCodeArchiveD = $(nameOfSourceBrancheD).zip
#nameOfSourceCodeArchive = test1.zip


nameOfArchiveSubFolder = $(nameOfRepo)-$(nameOfSourceBranche)
nameOfArchiveSubFolderT = $(nameOfRepo)-$(nameOfSourceBrancheT)
nameOfArchiveSubFolderD = $(nameOfRepo)-$(nameOfSourceBrancheD)


#----------------------------------------

rm = rm
rmRecursiveFlag = -r
rmSilentFlag = -f

SRC_FILES_CODE =  $(wildcard $(nameOfArchiveSubFolder)/*.js $(nameOfArchiveSubFolder)/*/*.js  $(nameOfArchiveSubFolder)/*/*/*.js)

OBJ_FILES_CODE = $(subst $(nameOfArchiveSubFolder)/,,$(SRC_FILES_CODE))

.PHONY: test updateLib update unzipArchive all removeArchive deleteArchive deleteTempSourceFolder clean updatePart1 updatePart2 cpMakeFile makeDir
#--------------------------

make = make

#-----------------------------------------------------


all: update

test: override nameOfSourceBranche = $(nameOfSourceBrancheT)
test: override nameOfArchiveSubFolder = $(nameOfRepo)-$(nameOfSourceBranche)
test: override nameOfSourceCodeArchive = $(nameOfSourceBranche).zip
test: override SRC_FILES_CODE =  $(wildcard $(nameOfArchiveSubFolder)/*.js $(nameOfArchiveSubFolder)/*/*.js  $(nameOfArchiveSubFolder)/*/*/*.js)
test: override OBJ_FILES_CODE = $(subst $(nameOfArchiveSubFolder)/,,$(SRC_FILES_CODE))
#test: override linkToRepoArchive = "https://github.com/asylamba/$(nameOfRepo)/archive/$(nameOfSourceBranche).zip"
test: update



makeDir:
	mkdir commandBot
	mkdir data
	mkdir data_bot
	mkdir doc
	mkdir mainBot
	mkdir musicBot
	mkdir test



	
updateLib:
	$(npm) $(npmInstallFlag) $(nodeJsLib) $(npmEndFlag)
	
updatePart1: $(nameOfSourceCodeArchiveT) $(nameOfSourceCodeArchiveD) unzipArchive

updatePart2: $(OBJ_FILES_CODE) clean

update: cpMakeFile $(OBJ_FILES_CODE) clean $(nameOfSourceCodeArchiveT) $(nameOfSourceCodeArchiveD) unzipArchive 
update:
	echo $(OBJ_FILES_CODE)
	echo $(nameOfArchiveSubFolder)
#temp solution

cpMakeFile:
	$(cp) $(nameOfArchiveSubFolder)/makefile makefile

cpMakeFile: .FORCE
#update: 
#	$(make) updatePart1
#	$(cp) $(nameOfArchiveSubFolder)/makefile makefile
#	$(make) updatePart2
	 

$(nameOfSourceCodeArchiveT):
	$(wget) $(linkToRepoArchiveT)

$(nameOfSourceCodeArchiveD):
	$(wget) $(linkToRepoArchiveD)

#$(nameOfSourceCodeArchive):
#	$(wget) $(linkToRepoArchive)
	
#-----------------------------------------------------

#setVar: override SRC_FILES_CODE =  $(wildcard $(nameOfArchiveSubFolder)/*.js $(nameOfArchiveSubFolder)/*/*.js  $(nameOfArchiveSubFolder)/*/*/*.js)
#setVar: override OBJ_FILES_CODE = $(subst $(nameOfArchiveSubFolder)/,,$(SRC_FILES_CODE))
#setVar:
#	$(eval override SRC_FILES_CODE =  $(wildcard $(nameOfArchiveSubFolder)/*.js $(nameOfArchiveSubFolder)/*/*.js  $(nameOfArchiveSubFolder)/*/*/*.js))
#	$(eval override OBJ_FILES_CODE = $(subst $(nameOfArchiveSubFolder)/,,$(SRC_FILES_CODE)))
#	echo $(OBJ_FILES_CODE)
#	echo $(SRC_FILES_CODE)
#----------------------------------------------------
	
unzipArchive:
	$(unzip) $(nameOfSourceBrancheD)
	$(unzip) $(nameOfSourceBrancheT)

#-----------------------------------------------------

	
%.js: 
	$(cp) $(nameOfArchiveSubFolder)/$@ $@

%.js: .FORCE
#-----------------------------------------------------

deleteArchive:
	$(rm) $(rmSilentFlag) $(nameOfSourceCodeArchiveD)
	$(rm) $(rmSilentFlag) $(nameOfSourceCodeArchiveT)
 
deleteTempSourceFolder:
	$(rm) $(rmSilentFlag) $(rmRecursiveFlag) $(nameOfArchiveSubFolderT)
	$(rm) $(rmSilentFlag) $(rmRecursiveFlag) $(nameOfArchiveSubFolderD)

clean: deleteArchive deleteTempSourceFolder

nodejs = nodejs
botManager =botManager.js

run: 
	$(nodejs) $(botManager)