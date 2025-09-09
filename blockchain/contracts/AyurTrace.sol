    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.0;

    contract AyurTrace {
        // Define a custom data type for an herb entry
        struct Herb {
            string name;
            string verifiedSpecies;
            uint256 confidenceScore;
            int latitude;
            int longitude;
            uint256 timestamp;
        }

        // A mapping to store herb entries with a unique ID
        // The unique ID will be the total number of entries, which we'll manage with a counter
        mapping(uint256 => Herb) public herbEntries;

        uint256 public herbCount;

        // An event to signal when a new herb entry has been added
        event HerbAdded(uint256 id, string name, string verifiedSpecies);

        // A function to add a new herb entry to the blockchain
        function addHerb(
            string memory _name,
            string memory _verifiedSpecies,
            uint256 _confidenceScore,
            int _latitude,
            int _longitude
        ) public {
            // Store the new herb entry
            herbEntries[herbCount] = Herb({
                name: _name,
                verifiedSpecies: _verifiedSpecies,
                confidenceScore: _confidenceScore,
                latitude: _latitude,
                longitude: _longitude,
                timestamp: block.timestamp
            });

            // Increment the counter for the next entry
            herbCount++;

            // Emit an event to log the action
            emit HerbAdded(herbCount, _name, _verifiedSpecies);
        }
    }