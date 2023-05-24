const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Notes", function() {
    let notesContract;

    beforeEach(async function() {
        const Notes = await ethers.getContractFactory("Notes");
        notesContract = await Notes.deploy();
        await notesContract.deployed();
    });

    it("should create note successfully", async function () {
        // 1\ we create note (id==1)
        // 2\ check if id in list
        let noteCreated = await notesContract.create("My 1st note");
        await expect(noteCreated).to.emit(notesContract, "NoteCreated").withArgs(1, "My 1st note");
    })


    it("should delete note successfully", async function () {
        await notesContract.create("My 1st note");
        let noteDeletedWithID_1 = await notesContract.deleteNote(1);
        await expect(noteDeletedWithID_1).to.emit(notesContract, "NoteDeleted").withArgs(1);
        await expect(notesContract.deleteNote(2)).to.be.revertedWith("Note does not exist");


        // 1\ we want to get 1st note
        // 2\ we want to delete it, we call deleteNote() function
        // 3\ check if note with id==1 is exist
    })

    it("should read note successfully && revert if note doesn't exit", async function () {
        let content = "My 1st note";
        await notesContract.create("My 1st note");
        let getContent = notesContract.read(1)
        await expect(content, getContent).to.equal("My 1st note")
        // 1\ get note content 
        // 2\ check if note.content returned equals to note.content written by me
        // 3\ check if it reverts with note.id==2
    })

    it("should update note && revert if note doesn't exist", async function () {
        await notesContract.create("My 1st note");
        await expect(notesContract.updateNote(1, "My best note")).to.emit(notesContract, "NoteUpdated").withArgs(1, "My best note");
        await expect(notesContract.updateNote(2, "My best note")).to.be.revertedWith("Note does not exist");
        // 1\ get note
        // 2\ update note 
        // 3\ check if note updated
        // 4\ check if it reverts with note.id==2
    })
})