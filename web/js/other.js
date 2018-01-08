var post_gitlab_form_data = function () {
    console.log("SUbmit");
    var post_data = {};
    post_data.first_name = $("#first-name").val();
    post_data.middle_name = $("#middle-name").val();
    post_data.last_name = $("#last-name").val();
    post_data.suffix = $("#suffix").val();
    post_data.address = $("#address").val();
    post_data.city = $("#city").val();
    post_data.state = $("#state").val();
    post_data.postal_code = $("#postal-code").val();
    post_data.country = $("#country").val();
    post_data.email_address = $("#email").val();
    post_data.phone_number = $("#phone-number").val();
    post_data.job_title = $("#job-title").val();
    post_data.employment_designation = $("#employment-designation").val();

    console.log(JSON.stringify(post_data));
};

//Keep at bottom
if (document.getElementById('gitlab-signup-page-identifier')) {
    $("#submit-btn").on('click', post_gitlab_form_data);
}