package com.project.data_center.entity.enums;

public final class MessageCodes {
        private MessageCodes() {}

        public static final String FIRST_NAME_REQUIRED = "FIRST_NAME_REQUIRED";
        public static final String FIRST_NAME_LENGTH_INVALID = "FIRST_NAME_LENGTH_INVALID";
        public static final String FIRST_NAME_FORMAT_INVALID = "FIRST_NAME_FORMAT_INVALID";

        public static final String LAST_NAME_REQUIRED = "LAST_NAME_REQUIRED";
        public static final String LAST_NAME_LENGTH_INVALID = "LAST_NAME_LENGTH_INVALID";
        public static final String LAST_NAME_FORMAT_INVALID = "LAST_NAME_FORMAT_INVALID";

        public static final String EMAIL_REQUIRED = "EMAIL_REQUIRED";
        public static final String EMAIL_FORMAT_INVALID = "EMAIL_FORMAT_INVALID";
        public static final String EMAIL_LENGTH_INVALID = "EMAIL_LENGTH_INVALID";

        public static final String PHONE_REQUIRED = "PHONE_REQUIRED";
        public static final String PHONE_FORMAT_INVALID = "PHONE_FORMAT_INVALID";

        public static final String DOCUMENT_NUMBER_REQUIRED = "DOCUMENT_NUMBER_REQUIRED";
        public static final String DOCUMENT_NUMBER_FORMAT_INVALID = "DOCUMENT_NUMBER_FORMAT_INVALID";
        public static final String DOCUMENT_NUMBER_LENGTH_INVALID = "DOCUMENT_NUMBER_LENGTH_INVALID";

        public static final String PASSWORD_REQUIRED = "PASSWORD_REQUIRED";
        public static final String PASSWORD_LENGTH_INVALID = "PASSWORD_LENGTH_INVALID";

        public static final String DOCUMENT_TYPE_REQUIRED = "DOCUMENT_TYPE_REQUIRED";

        public static final String ADDRESS_REQUIRED = "ADDRESS_REQUIRED";
    public static final String ADDRESS_LENGTH_INVALID = "ADDRESS_LENGTH_INVALID";

    public static final String DOCUMENT_TYPE_INVALID = "DOCUMENT_TYPE_INVALID";
    public static final String DOCUMENT_TYPE_NOT_FOUND = "DOCUMENT_TYPE_NOT_FOUND";
    public static final String EMAIL_ALREADY_EXISTS = "EMAIL_ALREADY_EXISTS";
    public static final String DOCUMENT_NUMBER_ALREADY_EXISTS = "DOCUMENT_NUMBER_ALREADY_EXISTS";

    public static final String INVALID_CREDENTIALS = "INVALID_CREDENTIALS";

    public static final String TOKEN_EXPIRED = "TOKEN_EXPIRED";
    public static final String TOKEN_INVALID = "TOKEN_INVALID";

    public static final String PERSON_NOT_FOUND = "PERSON_NOT_FOUND";

    public static final String REGISTRATION_SUCCESS = "REGISTRATION_SUCCESS";
    public static final String UPDATE_SUCCESS = "UPDATE_SUCCESS";
    public static final String ELIMINATION_SUCCESS = "ELIMINATION_SUCCESS";
    public static final String LOGIN_SUCCESS = "LOGIN_SUCCESS";

    public static final String INTERNAL_ERROR = "INTERNAL_ERROR";

    public static final String CITY_LENGTH_INVALID = "CITY_LENGTH_INVALID";
    public static final String COUNTRY_LENGTH_INVALID = "COUNTRY_LENGTH_INVALID";
    public static final String CITY_REQUIRED = "CITY_REQUIRED";

    public static final String COUNTRY_REQUIRED = "COUNTRY_REQUIRED";

    public static final String LATITUDE_REQUIRED = "LATITUDE_REQUIRED";
    public static final String LONGITUDE_REQUIRED = "LONGITUDE_REQUIRED";
}
