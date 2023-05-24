// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

contract Notes {
    struct Note {
        uint256 id;
        string content;
    }
    
    uint256 private currentId;
    mapping(address => Note[]) private notes;
    
    event NoteCreated(uint256 id, string content);
    event NoteUpdated(uint256 id, string content);
    event NoteDeleted(uint256 id);
    
    function create(string memory content) public {
        currentId++; // first id == 1
        notes[msg.sender].push(Note(currentId, content));
        emit NoteCreated(currentId, content);
    }
    
    function read(uint256 id) public view returns (string memory) {
        Note[] memory userNotes = notes[msg.sender];
        for (uint256 i = 0; i < userNotes.length; i++) {
            if (userNotes[i].id == id) {
                return userNotes[i].content;
            }
        }
        revert("Note does not exist");
    }
    
    function updateNote(uint256 id, string memory content) public {
        Note[] storage userNotes = notes[msg.sender];
        for (uint256 i = 0; i < userNotes.length; i++) {
            if (userNotes[i].id == id) {
                userNotes[i].content = content;
                emit NoteUpdated(id, content);
                return;
            }
        }
        revert("Note does not exist");
    }
    
    function deleteNote(uint256 id) public {
        Note[] storage userNotes = notes[msg.sender];
        for (uint256 i = 0; i < userNotes.length; i++) {
            if (userNotes[i].id == id) {
                delete userNotes[i];
                emit NoteDeleted(id);
                return;
            }
        }
        revert("Note does not exist");
    }
}