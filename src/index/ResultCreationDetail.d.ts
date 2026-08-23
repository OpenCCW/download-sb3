export interface ResultCreationDetail {
    body: Body;
    code: string;
    msg: string | null;
    status: number;
}

interface Body {
    artifactType: string;
    commentCount: number;
    createdAt: number;
    creationRelease: Release;
    creationReleaseList: Release[];
    currentHashTag: null;
    currentReleaseOid: string;
    description: string;
    eid: null;
    ext: Ext;
    favoriteCount: number;
    featuredCoverLink: string;
    firstPublishedRelease: Release;
    forEveryone: boolean;
    hashTags: string[];
    isOpenSource: boolean;
    isSelf: null;
    isTeamwork: boolean;
    keyboardLayout: string;
    lastPassedAt: number;
    latestCoverLink: string;
    latestProjectLink: string;
    likeCount: number;
    oid: string;
    operatedAt: number;
    projectLastModifiedAt: null;
    rank: string;
    remixCreationOid: null;
    remixedCount: number;
    remixedCreation: null;
    repostedSource: null;
    requireLogin: boolean;
    screenMode: string;
    sourceOpenLevel: string;
    stats: Stats;
    status: string;
    student: Student;
    studentOid: string;
    tags: any[];
    teamMemberRespList: any[];
    teamworkStatus: null;
    title: string;
    type: string;
    typicalProjectId: null;
    updatedAt: number;
    viewCount: number;
    visibleScope: string;
}

interface Student {
    approvedContent: null;
    approvedType: null;
    avatar: string;
    bio: string;
    commentCount: null;
    creationCount: null;
    favoriteCount: null;
    followerCount: null;
    followingCount: null;
    followingStatus: null;
    isSelf: null;
    likeCount: null;
    name: string;
    oid: string;
    picUrl: null;
    remixedCount: null;
    viewCount: null;
    virtualValue: null;
}

interface Stats {
    averageRating: number;
    mostApprovedReviewIds: any[];
    reviewCount: number;
    reviewTags: any[];
}

interface Ext {
    keyboardLayout: string;
    requireLogin: boolean;
    SUBMIT_HASH_TAGS: string[];
}

export interface Release {
    checked: boolean;
    coverGifLink: null;
    coverLink: string;
    createdAt: number;
    customVersion: string;
    description: string;
    extensions: string[];
    hasCloudVariables: boolean;
    keyboardLayout: string;
    oid: string;
    operatingInstruction: string;
    profiling: null;
    projectLink: string;
    status: string;
    submittedAt: number;
    tags: any[];
    updatedAt: number;
    version: string;
    videoLink: null;
}