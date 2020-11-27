/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import {IntrospectionField} from "graphql";

/**
 * An expectation is defined per entity we expect e.g. a Topic
 */
export interface Expectation {
    /**
     * The type is the GraphQL type for this expectation
     */
    type: string;
    /**
     * The fields that we expect this entity to have
     */
    fields?: {
        /**
         * The field is defined as a GraphQL type
         */
        [key: string]: string;
    };
    /**
     * The operations that we expect this entity to have
     */
    operations?: {
        /**
         * The operation is validated using a callback
         */
        [key: string]: OperationCallback;
    };
    /**
     * The subscriptions that we expect this entity to have
     */
    subscriptions?: {
        /**
         * The subscription is validated using a callback
         */
        [key: string]: SubscriptionCallback;
    };
}

/**
 * A collection of expected entities
 */
export interface Expectations {
    [key: string]: Expectation;
}

/**
 * An entity expresses whether an expectation has been met or not
 */
export interface Entity {
    /**
     * The type is the GraphQL type for this expectation
     */
    type: string;
    /**
     * The fields that we expect this entity to have
     */
    fields: {
        /**
         * Whether the field met the expectation
         */
        [key: string]: boolean;
    };
    /**
     * The operations that we expect this entity to have
     */
    operations: {
        /**
         * Whether the operation met the expectation
         */
        [key: string]: boolean;
    };
    /**
     * The subscriptions that we expect this entity to have
     */
    subscriptions: {
        /**
         * Whether the subscription met the expectation
         */
        [key: string]: boolean;
    };
}

/**
 * The callback properties for an operation expectation
 */
export interface OperationCallbackProps {
    /**
     * All the queries defined
     */
    queries: { [key: string]: IntrospectionField };
    /**
     * All the mutations defined
     */
    mutations: { [key: string]: IntrospectionField };
}

/**
 * The callback properties for a subscription expectation
 */
export interface SubscriptionCallbackProps {
    /**
     * All the subscriptions defined
     */
    subscriptions: { [key: string]: IntrospectionField };
}

/**
 * The callback for an operation expectation
 */
export interface OperationCallback {
    (props: OperationCallbackProps): boolean;
}

/**
 * The callback for a subscription expectation
 */
export interface SubscriptionCallback {
    (props: SubscriptionCallbackProps): boolean;
}

/**
 * A collection of entities
 */
export interface Entities {
    [key: string]: Entity;
}
