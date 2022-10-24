const searchInput = document.querySelector('#search');
const usersContainer = document.querySelector('.users-container');
let isMobileView = window.innerWidth <= 650;
let usersListData = [];
let timeout = null;

const fetchUsers = value => {
    usersContainer.classList.add('loading');
    fetch(`https://jsonplaceholder.typicode.com/users${value ? `?q=${value}` : ''}`)
        .then((response) => {
            if (!response.ok) {
                const error = response?.status + ' ' + response?.statusText;
                return Promise.reject(error);
            }
            return response.json();
        })
        .then(json => {
            usersListData = json;
            populateUsersList(json);
        })
        .catch(e => {
            usersContainer.innerHTML = 'Error: ' + e;
        })
        .finally(() => {
            usersContainer.classList.remove('loading');
        });
}

const toggleAccordion = id => {
    const accordionElement = document.getElementById(id);

    if (accordionElement.classList.contains('active')) {
        accordionElement.classList.remove('active')
    } else {
        const accordionElements = document.querySelectorAll('.accordion-item');
        accordionElements.forEach(accordion => {
            accordion.classList.remove('active');
        })
        accordionElement.classList.add('active');
    }
}

const populateUsersList = usersList => {
    usersContainer.innerHTML = '';

    if (usersList?.length && !isMobileView) {
        const usersTable = document.createElement('table');
        usersTable.className = 'users__table';

        const tableHead = `<th>ID</th><th>Name</th><th>Owner email</th><th>Phone</th><th>Company name</th>`;
        usersTable.innerHTML = tableHead + usersList?.map(user => {
            return `<tr>
                        <td>${user?.id || '-'}</td>
                        <td>${user?.name || '-'}</td>
                        <td>${user?.email || '-'}</td>
                        <td>${user?.phone || '-'}</td>
                        <td>${user?.company?.name || '-'}</td>
                    </tr>`;
        }).join('');
        usersContainer.appendChild(usersTable);
    } else if (usersList?.length && isMobileView) {
        const usersTableMobileView = usersList?.map(user => {
            return `<button class="accordion-item" id="user-${user?.id}" onclick="toggleAccordion('user-${user?.id}')">
                        <div class="accordion-item__label">
                            <p>${user?.id || '-'} ${user?.name}</p>
                            <img src="../img/arrow.svg" alt="arrow">
                        </div>
                        <div class="accordion-item__content">
                            <ul>
                                <li><b>Email:</b> ${user?.email || '-'}</li>
                                <li><b>Phone:</b> ${user?.phone || '-'}</li>
                                <li><b>Company name:</b> ${user?.company?.name || '-'}</li>
                            </ul>
                        </div>
                    </button>`;
        });
        usersContainer.innerHTML = usersTableMobileView.join('');
    } else {
        usersContainer.innerHTML =
            `<div class="no-users">
                <img src="../img/empty.svg" alt="empty">
                No users
            </div>`;
    }
}

// reacting on input search changes
// the request will fire only once every 300ms
searchInput.addEventListener('input', event => {
    if (timeout) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(function () {
        fetchUsers(event?.target?.value)
    }, 300);
});

// reacting on window resize to set the correct view of the user's list
window.onresize = event => {
    let isMobile = event?.target?.innerWidth <= 650;

    if (isMobileView !== isMobile) {
        isMobileView = isMobile;
        populateUsersList(usersListData);
    }
};

// fetch the initial users list
fetchUsers();