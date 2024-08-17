const { gql } = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
    type Query {
        getAssets(page: Int, pageSize: Int): [Asset!]!
        getAssetsByType(asset_type: AssetType!, page: Int, pageSize: Int): [Asset!]!
        getAssetsByDescriptionSearch(description: String!): [Asset!]!
        getKpis: [Kpi!]!
        getDataVizs: [DataViz!]!
        getLayouts: [Layout!]!
        getStoryboards: [Storyboard!]!
        getAsset(id: ID!): Asset
        getKpi(id: ID!): Kpi
        getDataViz(id: ID!): DataViz
        getLayout(id: ID!): Layout
        getStoryboard(id: ID!): Storyboard
        getBusinessQuestions: [BusinessQuestion!]!
        getMetrics: [Metric!]!
        getBusinessQuestion(id: ID!): BusinessQuestion
        getMetric(id: ID!): Metric
    }

    type Mutation {
        signUp(input: SignUpInput): AuthUser!
        signIn(input: SignInInput): AuthUser!

        createAsset(input: AssetInput!): Asset!
        updateAsset(id: ID!, input: AssetInput!): Asset!
        deleteAsset(id: ID!): Boolean
        createAssets(input: [AssetInput]!): [Asset!]!
        
        createKpi(input: KpiInput!): Kpi!
        updateKpi(id: ID!, input: KpiInput!): Kpi!
        deleteKpi(id: ID!): Boolean

        createDataViz(input: DataVizInput!): DataViz!
        updateDataViz(id: ID!, input: DataVizInput!): DataViz!
        deleteDataViz(id: ID!): Boolean

        createLayout(input: LayoutInput!): Layout!
        updateLayout(id: ID!, input: LayoutInput!): Layout!
        deleteLayout(id: ID!): Boolean

        createStoryboard(input: StoryboardInput!): Storyboard!
        updateStoryboard(id: ID!, input: StoryboardInput!): Storyboard!
        deleteStoryboard(id: ID!): Boolean

        createBusinessQuestion(input: BusinessQuestionInput!): BusinessQuestion!
        updateBusinessQuestion(id: ID!, input: BusinessQuestionInput!): BusinessQuestion!
        deleteBusinessQuestion(id: ID!): Boolean

        createMetric(input: MetricInput!): Metric!
        updateMetric(id: ID!, input: MetricInput!): Metric!
        deleteMetric(id: ID!): Boolean

    }

    enum AssetType {
        KPI
        DATAVIZ
        LAYOUT
        STORYBOARD
    }

    input SignUpInput {
        email: String!
        password: String!
        name: String!
        avatar: String
    }

    input SignInInput {
        email: String!
        password: String!
    }

    input AssetInput {
        name: String!
        description: String!
        is_favorite: Boolean!
        asset_type: AssetType!
        kpi: KpiInput
        dataViz: DataVizInput
        layout: LayoutInput
        storyboard: StoryboardInput
    }

    input KpiInput {
        name: String!
        assetId: ID
        description: String
        calculation: String
        visuals_available: Boolean
        affiliate_applicable: Boolean
        businessQuestions: [BusinessQuestionInput]
        metrics: [MetricInput]
    }

    input DataVizInput {
        assetId: ID
        applicable_kpi_favourite: [KpiInput]
        asset_info_context: String
    }

    input LayoutInput {
        assetId: ID
        amount_of_pages: Int
        kpis_being_used: [KpiInput]
    }

    input StoryboardInput {
        assetId: ID
        affiliate_applicable: String
        kpis_being_used: [KpiInput]
    }

    input BusinessQuestionInput {
        question: String!
        answer: String!
    }

    input MetricInput {
        name: String!
        value: String!
    }

    scalar DateTime
    type AuthUser {
        user: User!
        token: String!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        avatar: String
    }

    type Asset {
        id: ID!
        name: String!
        description: String
        is_favorite: Boolean
        asset_type: AssetType!
        kpi: Kpi
        dataViz: DataViz
        layout: Layout
        storyboard: Storyboard
        created_at: DateTime!
        updated_at: DateTime!
    }

    type BusinessQuestion {
        id: ID!
        question: String!
        answer: String!
    }

    type Metric {
        id: ID!
        name: String!
        value: String!
    }

    type Kpi {
        id: ID!
        name: String!
        description: String
        calculation: String
        visuals_available: Boolean
        affiliate_applicable: Boolean
        businessQuestions: [BusinessQuestion]
        metrics: [Metric]
        created_at: DateTime
        updated_at: DateTime
        assetId: ID
    }

    type DataViz {
        id: ID!
        applicable_kpi_favourite: [Kpi]
        asset_info_context: String
        created_at: DateTime
        updated_at: DateTime
        assetId: ID
    }

    type Layout {
        id: ID!
        amount_of_pages: Int
        kpis_being_used: [Kpi]
        created_at: DateTime
        updated_at: DateTime
        assetId: ID
    }

    type Storyboard {
        id: ID!
        affiliate_applicable: String
        kpis_being_used: [Kpi]
        created_at: DateTime
        updated_at: DateTime
        assetId: ID
    }
`;

module.exports = typeDefs;