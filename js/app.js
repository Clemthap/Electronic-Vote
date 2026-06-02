/* ==========================================
   RESIDENCE VOTING SYSTEM
   MASTER JAVASCRIPT FILE
========================================== */

/* ==========================================
   PAGE DETECTION
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeHomePage();
    initializeRegisterPage();
    initializeVotingPage();

});

/* ==========================================
   HOME PAGE
   index.html
========================================== */

function initializeHomePage(){

    const registeredElement =
    document.getElementById(
        "registeredStudents"
    );

    if(!registeredElement) return;

    loadHomeStatistics();

}

function loadHomeStatistics(){

    const registered =
    parseInt(
        localStorage.getItem(
            "registeredStudents"
        )
    ) || 0;

    const votedStudents =
    JSON.parse(
        localStorage.getItem(
            "votedStudents"
        )
    ) || [];

    document.getElementById(
        "registeredStudents"
    ).innerText = registered;

    document.getElementById(
        "votedStudents"
    ).innerText = votedStudents.length;

    let turnout = 0;

    if(registered > 0){

        turnout =
        (
            votedStudents.length /
            registered
        ) * 100;

    }

    document.getElementById(
        "turnoutRate"
    ).innerText =
    turnout.toFixed(1) + "%";

}

/* ==========================================
   REGISTRATION PAGE
   register.html
========================================== */

function initializeRegisterPage(){

    const registerForm =
    document.getElementById(
        "registerForm"
    );

    if(!registerForm) return;

    registerForm.addEventListener(
        "submit",
        registerStudent
    );

}

function registerStudent(event){

    event.preventDefault();

    const studentNumber =
    document.getElementById(
        "studentNumber"
    ).value.trim();

    const residence =
    document.getElementById(
        "residence"
    ).value;

    let students =
    JSON.parse(
        localStorage.getItem(
            "students"
        )
    ) || [];

    const exists =
    students.find(
        student =>
        student.studentNumber ===
        studentNumber
    );

    if(exists){

        alert(
            "Student already registered."
        );

        return;

    }

    students.push({

        studentNumber,
        residence

    });

    localStorage.setItem(
        "students",
        JSON.stringify(
            students
        )
    );

    localStorage.setItem(
        "registeredStudents",
        students.length
    );

    localStorage.setItem(
        "currentStudent",
        studentNumber
    );

    localStorage.setItem(
        "currentResidence",
        residence
    );

    window.location =
    "voting.html";

}

/* ==========================================
   VOTING PAGE
   voting.html
========================================== */

function initializeVotingPage(){

    const voteButton =
    document.getElementById(
        "submitVote"
    );

    if(!voteButton) return;

    loadVotingPage();

    voteButton.addEventListener(
        "click",
        submitVote
    );

}

function loadVotingPage(){

    const student =
    localStorage.getItem(
        "currentStudent"
    );

    const residence =
    localStorage.getItem(
        "currentResidence"
    );

    if(!student){

        window.location =
        "register.html";

        return;

    }

    const display =
    document.getElementById(
        "studentDisplay"
    );

    if(display){

        display.innerHTML =

        `
        Student Number:
        <strong>${student}</strong>
        <br>
        Residence:
        <strong>${residence}</strong>
        `;

    }

    updateVotingDashboard();

    disableVotingIfAlreadyVoted();

}

function submitVote(){

    const student =
    localStorage.getItem(
        "currentStudent"
    );

    let votedStudents =
    JSON.parse(
        localStorage.getItem(
            "votedStudents"
        )
    ) || [];

    if(
        votedStudents.includes(
            student
        )
    ){

        alert(
            "You have already voted."
        );

        return;

    }

    const chairperson =
    document.querySelector(
        'input[name="chairperson"]:checked'
    );

    const secretary =
    document.querySelector(
        'input[name="secretary"]:checked'
    );

    if(
        !chairperson ||
        !secretary
    ){

        alert(
            "Please select all positions."
        );

        return;

    }

    votedStudents.push(
        student
    );

    localStorage.setItem(
        "votedStudents",
        JSON.stringify(
            votedStudents
        )
    );

    let votes =
    JSON.parse(
        localStorage.getItem(
            "votes"
        )
    ) || {};

    votes[
        chairperson.value
    ] =
    (
        votes[
            chairperson.value
        ] || 0
    ) + 1;

    votes[
        secretary.value
    ] =
    (
        votes[
            secretary.value
        ] || 0
    ) + 1;

    localStorage.setItem(
        "votes",
        JSON.stringify(
            votes
        )
    );

    updateVotingDashboard();

    disableVotingIfAlreadyVoted();

    alert(
        "Vote submitted successfully."
    );

}

function disableVotingIfAlreadyVoted(){

    const student =
    localStorage.getItem(
        "currentStudent"
    );

    const votedStudents =
    JSON.parse(
        localStorage.getItem(
            "votedStudents"
        )
    ) || [];

    if(
        votedStudents.includes(
            student
        )
    ){

        const button =
        document.getElementById(
            "submitVote"
        );

        if(button){

            button.disabled = true;

            button.innerText =
            "Vote Already Submitted";

        }

        document
        .querySelectorAll(
            'input[type="radio"]'
        )
        .forEach(input => {

            input.disabled = true;

        });

    }

}

function updateVotingDashboard(){

    const registered =
    parseInt(
        localStorage.getItem(
            "registeredStudents"
        )
    ) || 0;

    const votedStudents =
    JSON.parse(
        localStorage.getItem(
            "votedStudents"
        )
    ) || [];

    const votedCount =
    votedStudents.length;

    let turnout = 0;

    if(registered > 0){

        turnout =
        (
            votedCount /
            registered
        ) * 100;

    }

    const registeredElement =
    document.getElementById(
        "liveRegistered"
    );

    const turnoutElement =
    document.getElementById(
        "liveTurnout"
    );

    if(registeredElement){

        registeredElement.innerText =
        registered;

    }

    if(turnoutElement){

        turnoutElement.innerText =
        turnout.toFixed(1) + "%";

    }

}

/* ==========================================
   UTILITY FUNCTIONS
========================================== */

function clearElectionData(){

    localStorage.removeItem(
        "students"
    );

    localStorage.removeItem(
        "votes"
    );

    localStorage.removeItem(
        "votedStudents"
    );

    localStorage.removeItem(
        "registeredStudents"
    );

    localStorage.removeItem(
        "currentStudent"
    );

    localStorage.removeItem(
        "currentResidence"
    );

}