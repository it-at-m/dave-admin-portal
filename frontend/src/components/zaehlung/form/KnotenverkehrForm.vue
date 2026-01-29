<template>
  <v-sheet
    width="100%"
    :height="height"
    :max-height="height"
    color="transparent"
    class="d-flex flex-row justify-center overflow-y-auto"
  >
    <svg
      :height="height"
      :width="height"
      viewBox="0 0 1400 1400"
      preserveAspectRatio="xMidYMid"
      fill-rule="evenodd"
      stroke-width="28.222"
      stroke-linejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      xml:space="preserve"
    >
      <!--      <g-->
      <!--        id="nodes5To8"-->
      <!--        class="Page"-->
      <!--        transform="rotate(45,14344.644,17924.82)"-->
      <!--      >-->
      <!--        <g-->
      <!--          id="node8_group"-->
      <!--          class="com.sun.star.drawing.ClosedBezierShape"-->
      <!--          transform="rotate(-90,14358.457,17794.588)"-->
      <!--        >-->
      <!--          <g-->
      <!--            id="node8"-->
      <!--            transform="matrix(1,0,0,1.0009009,-18.516399,-18.516303)"-->
      <!--          >-->
      <!--            <path-->
      <!--              id="path117"-->
      <!--              d="m 14332.005,17842 v -507 l 44.969,-48 44.969,48 v 507 z"-->
      <!--              :fill="getColorOfKnotenarm('8')"-->
      <!--              stroke="none"-->
      <!--            />-->
      <!--            <text-->
      <!--              id="text117"-->
      <!--              xml:space="preserve"-->
      <!--              style="-->
      <!--                font-size: 63.0885px;-->
      <!--                text-align: start;-->
      <!--                writing-mode: lr-tb;-->
      <!--                direction: ltr;-->
      <!--                text-anchor: start;-->
      <!--                fill: #ffffff;-->
      <!--                stroke-width: 38.9418;-->
      <!--              "-->
      <!--              x="23207.291"-->
      <!--              y="2053.7427"-->
      <!--              transform="matrix(0.68301124,0.68239646,-0.73271189,0.73205238,0,0)"-->
      <!--              :style="{ cursor: getCursorType('8') }"-->
      <!--              @click="activateOrDeactivateTotalKnotenarm('8')"-->
      <!--            >-->
      <!--              8-->
      <!--            </text>-->
      <!--          </g>-->
      <!--          <g-->
      <!--            v-if="isKnotenarmAvailable('8')"-->
      <!--            id="node8_arrows"-->
      <!--          >-->
      <!--            <g-->
      <!--              v-if="zaehlung.zaehlart === Zaehlart.FJS"-->
      <!--              id="node8_left"-->
      <!--              transform="matrix(0.94605826,0,0,0.98386895,758.7668,274.96713)"-->
      <!--            >-->
      <!--              <path-->
      <!--                id="path118"-->
      <!--                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"-->
      <!--                stroke="none"-->
      <!--                :style="{ cursor: 'pointer' }"-->
      <!--                :fill="calculateColor('8LU')"-->
      <!--                @click="activateKnotenarm('8LU')"-->
      <!--              />-->
      <!--              <path-->
      <!--                id="path119"-->
      <!--                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"-->
      <!--                stroke="none"-->
      <!--                :style="{ cursor: 'pointer' }"-->
      <!--                :fill="calculateColor('8LD')"-->
      <!--                @click="activateKnotenarm('8LD')"-->
      <!--              />-->
      <!--            </g>-->
      <!--            <g-->
      <!--              v-if="zaehlung.zaehlart === Zaehlart.FJS"-->
      <!--              id="node8_right"-->
      <!--              transform="matrix(0.94605826,0,0,0.98386895,906.90013,274.96713)"-->
      <!--            >-->
      <!--              <path-->
      <!--                id="path120"-->
      <!--                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"-->
      <!--                stroke="none"-->
      <!--                :style="{ cursor: 'pointer' }"-->
      <!--                :fill="calculateColor('8RU')"-->
      <!--                @click="activateKnotenarm('8RU')"-->
      <!--              />-->
      <!--              <path-->
      <!--                id="path121"-->
      <!--                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"-->
      <!--                stroke="none"-->
      <!--                :style="{ cursor: 'pointer' }"-->
      <!--                :fill="calculateColor('8RD')"-->
      <!--                @click="activateKnotenarm('8RD')"-->
      <!--              />-->
      <!--            </g>-->
      <!--            <g-->
      <!--              v-if="zaehlung.zaehlart === Zaehlart.QU"-->
      <!--              id="node8_crossing"-->
      <!--              transform="matrix(0,0.94605826,-0.79773158,0,28267.575,4038.8282)"-->
      <!--            >-->
      <!--              <path-->
      <!--                id="path124"-->
      <!--                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"-->
      <!--                stroke="none"-->
      <!--                :style="{ cursor: 'pointer' }"-->
      <!--                :fill="calculateColor('8CL2R')"-->
      <!--                @click="activateKnotenarm('8CL2R')"-->
      <!--              />-->
      <!--              <path-->
      <!--                id="path125"-->
      <!--                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"-->
      <!--                stroke="none"-->
      <!--                :style="{ cursor: 'pointer' }"-->
      <!--                :fill="calculateColor('8CR2L')"-->
      <!--                @click="activateKnotenarm('8CR2L')"-->
      <!--              />-->
      <!--            </g>-->
      <!--          </g>-->
      <!--        </g>-->
      <!--        <g-->
      <!--          id="node7_group"-->
      <!--          class="com.sun.star.drawing.ClosedBezierShape"-->
      <!--          transform="rotate(180,14358.458,17794.588)"-->
      <!--        >-->
      <!--          <g-->
      <!--            id="node7"-->
      <!--            transform="matrix(1,0,0,1.0009009,-18.516399,-18.516303)"-->
      <!--          >-->
      <!--            <path-->
      <!--              id="path108"-->
      <!--              d="m 14332.005,17842 v -507 l 44.969,-48 44.969,48 v 507 z"-->
      <!--              :fill="getColorOfKnotenarm('7')"-->
      <!--              stroke="none"-->
      <!--            />-->
      <!--            <text-->
      <!--              id="text108"-->
      <!--              xml:space="preserve"-->
      <!--              style="-->
      <!--                font-size: 63.0885px;-->
      <!--                text-align: start;-->
      <!--                writing-mode: lr-tb;-->
      <!--                direction: ltr;-->
      <!--                text-anchor: start;-->
      <!--                fill: #ffffff;-->
      <!--                stroke-width: 38.9418;-->
      <!--              "-->
      <!--              x="2159.0249"-->
      <!--              y="-21628.908"-->
      <!--              transform="matrix(-0.68301123,0.68239646,-0.73271189,-0.73205239,0,0)"-->
      <!--              :style="{ cursor: getCursorType('7') }"-->
      <!--              @click="activateOrDeactivateTotalKnotenarm('7')"-->
      <!--            >-->
      <!--              7-->
      <!--            </text>-->
      <!--          </g>-->
      <!--          <g-->
      <!--            v-if="isKnotenarmAvailable('7')"-->
      <!--            id="node7_arrows"-->
      <!--          >-->
      <!--            <g-->
      <!--              v-if="zaehlung.zaehlart === Zaehlart.FJS"-->
      <!--              id="node7_left"-->
      <!--              transform="matrix(0.94605826,0,0,0.98386895,758.7668,274.96713)"-->
      <!--            >-->
      <!--              <path-->
      <!--                id="path109"-->
      <!--                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"-->
      <!--                stroke="none"-->
      <!--                :style="{ cursor: 'pointer' }"-->
      <!--                :fill="calculateColor('7LU')"-->
      <!--                @click="activateKnotenarm('7LU')"-->
      <!--              />-->
      <!--              <path-->
      <!--                id="path110"-->
      <!--                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"-->
      <!--                stroke="none"-->
      <!--                :style="{ cursor: 'pointer' }"-->
      <!--                :fill="calculateColor('7LD')"-->
      <!--                @click="activateKnotenarm('7LD')"-->
      <!--              />-->
      <!--            </g>-->
      <!--            <g-->
      <!--              v-if="zaehlung.zaehlart === Zaehlart.FJS"-->
      <!--              id="node7_right"-->
      <!--              transform="matrix(0.94605826,0,0,0.98386895,906.90013,274.96713)"-->
      <!--            >-->
      <!--              <path-->
      <!--                id="path111"-->
      <!--                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"-->
      <!--                stroke="none"-->
      <!--                :style="{ cursor: 'pointer' }"-->
      <!--                :fill="calculateColor('7RU')"-->
      <!--                @click="activateKnotenarm('7RU')"-->
      <!--              />-->
      <!--              <path-->
      <!--                id="path112"-->
      <!--                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"-->
      <!--                stroke="none"-->
      <!--                :style="{ cursor: 'pointer' }"-->
      <!--                :fill="calculateColor('7RD')"-->
      <!--                @click="activateKnotenarm('7RD')"-->
      <!--              />-->
      <!--            </g>-->
      <!--            <g-->
      <!--              v-if="zaehlung.zaehlart === Zaehlart.QU"-->
      <!--              id="node7_crossing"-->
      <!--              transform="matrix(0,0.94605826,-0.79773158,0,28267.575,4038.8282)"-->
      <!--            >-->
      <!--              <path-->
      <!--                id="path115"-->
      <!--                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"-->
      <!--                stroke="none"-->
      <!--                :style="{ cursor: 'pointer' }"-->
      <!--                :fill="calculateColor('7CL2R')"-->
      <!--                @click="activateKnotenarm('7CL2R')"-->
      <!--              />-->
      <!--              <path-->
      <!--                id="path116"-->
      <!--                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"-->
      <!--                stroke="none"-->
      <!--                :style="{ cursor: 'pointer' }"-->
      <!--                :fill="calculateColor('7CR2L')"-->
      <!--                @click="activateKnotenarm('7CR2L')"-->
      <!--              />-->
      <!--            </g>-->
      <!--          </g>-->
      <!--        </g>-->
      <!--        <g-->
      <!--          id="node6_group"-->
      <!--          class="com.sun.star.drawing.ClosedBezierShape"-->
      <!--          transform="rotate(90,14358.458,17794.588)"-->
      <!--        >-->
      <!--          <g-->
      <!--            id="node6"-->
      <!--            transform="matrix(1,0,0,1.0009009,-18.516399,-18.516303)"-->
      <!--          >-->
      <!--            <path-->
      <!--              id="path99"-->
      <!--              d="m 14332.005,17842 v -507 l 44.969,-48 44.969,48 v 507 z"-->
      <!--              :fill="getColorOfKnotenarm('6')"-->
      <!--              stroke="none"-->
      <!--            />-->
      <!--            <text-->
      <!--              id="text99"-->
      <!--              xml:space="preserve"-->
      <!--              style="-->
      <!--                font-size: 63.0885px;-->
      <!--                text-align: start;-->
      <!--                writing-mode: lr-tb;-->
      <!--                direction: ltr;-->
      <!--                text-anchor: start;-->
      <!--                fill: #ffffff;-->
      <!--                stroke-width: 38.9418;-->
      <!--              "-->
      <!--              x="-23247.984"-->
      <!--              y="-2008.0264"-->
      <!--              transform="matrix(-0.68301123,-0.68239646,0.73271189,-0.73205239,0,0)"-->
      <!--              :style="{ cursor: getCursorType('6') }"-->
      <!--              @click="activateOrDeactivateTotalKnotenarm('6')"-->
      <!--            >-->
      <!--              6-->
      <!--            </text>-->
      <!--          </g>-->
      <!--          <g-->
      <!--            v-if="isKnotenarmAvailable('6')"-->
      <!--            id="node6_arrows"-->
      <!--          >-->
      <!--            <g-->
      <!--              v-if="zaehlung.zaehlart === Zaehlart.FJS"-->
      <!--              id="node6_left"-->
      <!--              transform="matrix(0.94605826,0,0,0.98386895,758.7668,274.96713)"-->
      <!--            >-->
      <!--              <path-->
      <!--                id="path100"-->
      <!--                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"-->
      <!--                stroke="none"-->
      <!--                :style="{ cursor: 'pointer' }"-->
      <!--                :fill="calculateColor('6LU')"-->
      <!--                @click="activateKnotenarm('6LU')"-->
      <!--              />-->
      <!--              <path-->
      <!--                id="path101"-->
      <!--                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"-->
      <!--                stroke="none"-->
      <!--                :style="{ cursor: 'pointer' }"-->
      <!--                :fill="calculateColor('6LD')"-->
      <!--                @click="activateKnotenarm('6LD')"-->
      <!--              />-->
      <!--            </g>-->
      <!--            <g-->
      <!--              v-if="zaehlung.zaehlart === Zaehlart.FJS"-->
      <!--              id="node6_right"-->
      <!--              transform="matrix(0.94605826,0,0,0.98386895,906.90013,274.96713)"-->
      <!--            >-->
      <!--              <path-->
      <!--                id="path102"-->
      <!--                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"-->
      <!--                stroke="none"-->
      <!--                :style="{ cursor: 'pointer' }"-->
      <!--                :fill="calculateColor('6RU')"-->
      <!--                @click="activateKnotenarm('6RU')"-->
      <!--              />-->
      <!--              <path-->
      <!--                id="path103"-->
      <!--                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"-->
      <!--                stroke="none"-->
      <!--                :style="{ cursor: 'pointer' }"-->
      <!--                :fill="calculateColor('6RD')"-->
      <!--                @click="activateKnotenarm('6RD')"-->
      <!--              />-->
      <!--            </g>-->
      <!--            <g-->
      <!--              v-if="zaehlung.zaehlart === Zaehlart.QU"-->
      <!--              id="node6_crossing"-->
      <!--              transform="matrix(0,0.94605826,-0.79773158,0,28267.575,4038.8282)"-->
      <!--            >-->
      <!--              <path-->
      <!--                id="path106"-->
      <!--                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"-->
      <!--                stroke="none"-->
      <!--                :style="{ cursor: 'pointer' }"-->
      <!--                :fill="calculateColor('6CL2R')"-->
      <!--                @click="activateKnotenarm('6CL2R')"-->
      <!--              />-->
      <!--              <path-->
      <!--                id="path107"-->
      <!--                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"-->
      <!--                stroke="none"-->
      <!--                :style="{ cursor: 'pointer' }"-->
      <!--                :fill="calculateColor('6CR2L')"-->
      <!--                @click="activateKnotenarm('6CR2L')"-->
      <!--              />-->
      <!--            </g>-->
      <!--          </g>-->
      <!--        </g>-->
      <!--        <g-->
      <!--          id="node5_group"-->
      <!--          class="com.sun.star.drawing.ClosedBezierShape"-->
      <!--        >-->
      <!--          <g-->
      <!--            id="node5_arrow"-->
      <!--            transform="matrix(1,0,0,1.0009009,-18.516399,-18.516303)"-->
      <!--          >-->
      <!--            <path-->
      <!--              id="path90"-->
      <!--              d="m 14332.005,17842 v -507 l 44.969,-48 44.969,48 v 507 z"-->
      <!--              :fill="getColorOfKnotenarm('5')"-->
      <!--              stroke="none"-->
      <!--            />-->
      <!--            <text-->
      <!--              id="text90"-->
      <!--              xml:space="preserve"-->
      <!--              style="-->
      <!--                font-size: 63.0885px;-->
      <!--                text-align: start;-->
      <!--                writing-mode: lr-tb;-->
      <!--                direction: ltr;-->
      <!--                text-anchor: start;-->
      <!--                fill: #ffffff;-->
      <!--                stroke-width: 38.9418;-->
      <!--              "-->
      <!--              x="-2199.2236"-->
      <!--              y="21674.625"-->
      <!--              transform="matrix(0.68301124,-0.68239646,0.73271189,0.73205238,0,0)"-->
      <!--              :style="{ cursor: getCursorType('5') }"-->
      <!--              @click="activateOrDeactivateTotalKnotenarm('5')"-->
      <!--            >-->
      <!--              5-->
      <!--            </text>-->
      <!--          </g>-->
      <!--          <g-->
      <!--            v-if="isKnotenarmAvailable('5')"-->
      <!--            id="node5_arrows"-->
      <!--          >-->
      <!--            <g-->
      <!--              v-if="zaehlung.zaehlart === Zaehlart.FJS"-->
      <!--              id="node5_left"-->
      <!--              transform="matrix(0.94605826,0,0,0.98386895,758.7668,274.96713)"-->
      <!--            >-->
      <!--              <path-->
      <!--                id="path91"-->
      <!--                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"-->
      <!--                stroke="none"-->
      <!--                :style="{ cursor: 'pointer' }"-->
      <!--                :fill="calculateColor('5LU')"-->
      <!--                @click="activateKnotenarm('5LU')"-->
      <!--              />-->
      <!--              <path-->
      <!--                id="path92"-->
      <!--                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"-->
      <!--                stroke="none"-->
      <!--                :style="{ cursor: 'pointer' }"-->
      <!--                :fill="calculateColor('5LD')"-->
      <!--                @click="activateKnotenarm('5LD')"-->
      <!--              />-->
      <!--            </g>-->
      <!--            <g-->
      <!--              v-if="zaehlung.zaehlart === Zaehlart.FJS"-->
      <!--              id="node5_right"-->
      <!--              transform="matrix(0.94605826,0,0,0.98386895,906.90013,274.96713)"-->
      <!--            >-->
      <!--              <path-->
      <!--                id="path93"-->
      <!--                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"-->
      <!--                stroke="none"-->
      <!--                :style="{ cursor: 'pointer' }"-->
      <!--                :fill="calculateColor('5RU')"-->
      <!--                @click="activateKnotenarm('5RU')"-->
      <!--              />-->
      <!--              <path-->
      <!--                id="path94"-->
      <!--                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"-->
      <!--                stroke="none"-->
      <!--                :style="{ cursor: 'pointer' }"-->
      <!--                :fill="calculateColor('5RD')"-->
      <!--                @click="activateKnotenarm('5RD')"-->
      <!--              />-->
      <!--            </g>-->
      <!--            <g-->
      <!--              v-if="zaehlung.zaehlart === Zaehlart.QU"-->
      <!--              id="node5_crossing"-->
      <!--              transform="matrix(0,0.94605826,-0.79773158,0,28267.575,4038.8282)"-->
      <!--            >-->
      <!--              <path-->
      <!--                id="path97"-->
      <!--                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"-->
      <!--                stroke="none"-->
      <!--                :style="{ cursor: 'pointer' }"-->
      <!--                :fill="calculateColor('5CL2R')"-->
      <!--                @click="activateKnotenarm('5CL2R')"-->
      <!--              />-->
      <!--              <path-->
      <!--                id="path98"-->
      <!--                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"-->
      <!--                stroke="none"-->
      <!--                :style="{ cursor: 'pointer' }"-->
      <!--                :fill="calculateColor('5CR2L')"-->
      <!--                @click="activateKnotenarm('5CR2L')"-->
      <!--              />-->
      <!--            </g>-->
      <!--          </g>-->
      <!--        </g>-->
      <!--      </g>-->

      <g
        id="g26"
        class="Page"
        transform="rotate(45,699.9999,699.99989)"
      >
        <g
          id="g8"
          class="com.sun.star.drawing.ClosedBezierShape"
          transform="rotate(-90,14358.457,17794.588)"
        >
          <g id="g6">
            <g id="g3">
              <path
                id="path2"
                d="m 31340.268,3567.7232 v 194.445 h 15.555 l -27.221,38.888 -27.223,-38.888 h 15.555 v -194.445 z"
                fill="#000000"
                stroke="none"
                style="stroke-width: 26.1801"
              />
              <path
                id="path3"
                d="m 31363.6,3801.0562 v -194.445 h -15.556 l 27.221,-38.888 27.224,38.888 h -15.556 v 194.445 z"
                fill="#000000"
                stroke="none"
                style="stroke-width: 26.18"
              />
            </g>
            <g id="g5">
              <path
                id="path4"
                d="m 31542.49,3567.7232 v 194.445 h 15.555 l -27.22,38.888 -27.224,-38.888 h 15.555 v -194.445 z"
                fill="#000000"
                stroke="none"
                style="stroke-width: 26.18"
              />
              <path
                id="path5"
                d="m 31565.823,3801.0566 v -194.4453 h -15.555 l 27.221,-38.8881 27.223,38.8881 h -15.555 v 194.4453 z"
                fill="#000000"
                stroke="none"
                style="stroke-width: 26.18"
              />
            </g>
          </g>
          <g id="g7">
            <path
              id="path6"
              d="m 31414.156,4136.131 v -568.4076 l 38.889,-53.8146 38.889,53.8135 v 568.4087 z"
              fill="#1565c0"
              stroke="none"
              style="stroke-width: 17.1546"
            />
            <text
              id="text6"
              xml:space="preserve"
              style="
                font-size: 63.0899px;
                text-align: start;
                writing-mode: lr-tb;
                direction: ltr;
                text-anchor: start;
                fill: #ffffff;
                stroke-width: 38.9426;
              "
              x="3693.3091"
              y="-30336.191"
              transform="matrix(0,0.96513032,-1.0361295,0,0,0)"
            >
              4
            </text>
          </g>
        </g>
        <g
          id="g10"
          class="com.sun.star.drawing.ClosedBezierShape"
          transform="rotate(180,14358.458,17794.588)"
        >
          <g id="g9">
            <path
              id="path8"
              d="m 27978.027,34889.176 v -568.409 l 38.889,-53.813 38.889,53.813 v 568.409 z"
              fill="#1565c0"
              stroke="none"
              style="stroke-width: 17.1546"
            />
            <text
              id="text8"
              xml:space="preserve"
              style="
                font-size: 63.0916px;
                text-align: start;
                writing-mode: lr-tb;
                direction: ltr;
                text-anchor: start;
                fill: #ffffff;
                stroke-width: 38.9437;
              "
              x="-29025.062"
              y="-33144.508"
              transform="scale(-0.96597078,-1.035228)"
            >
              3
            </text>
          </g>
        </g>
        <g
          id="g17"
          class="com.sun.star.drawing.ClosedBezierShape"
          transform="rotate(90,14358.458,17794.588)"
        >
          <g id="g11">
            <path
              id="path10"
              d="m -2775.0189,31453.046 v -568.408 l 38.889,-53.814 38.889,53.813 v 568.409 z"
              fill="#1565c0"
              stroke="none"
              style="stroke-width: 17.1547"
            />
            <text
              id="text10"
              xml:space="preserve"
              style="
                font-size: 63.0877px;
                text-align: start;
                writing-mode: lr-tb;
                direction: ltr;
                text-anchor: start;
                fill: #ffffff;
                stroke-width: 38.9413;
              "
              x="-32040.105"
              y="-2619.9963"
              transform="matrix(0,-0.96506671,1.0361978,0,0,0)"
            >
              2
            </text>
          </g>
          <g id="g16">
            <g id="g12">
              <path
                id="path11"
                d="m -2633.3522,31117.972 v -194.445 h -13.3333 l 23.3321,-38.888 23.3346,38.888 h -13.3333 v 194.445 z"
                fill="#000000"
                stroke="none"
                style="stroke-width: 24.238"
              />
              <path
                id="path12"
                d="m -2652.241,30884.639 v 194.445 h 13.3333 l -23.3322,38.888 -23.3345,-38.888 h 13.3333 v -194.445 z"
                fill="#000000"
                stroke="none"
                style="stroke-width: 24.238"
              />
            </g>
            <g id="g14">
              <path
                id="path13"
                d="m -2820.0189,31117.972 v -194.445 h -13.3333 l 23.3322,-38.888 23.3345,38.888 h -13.3333 v 194.445 z"
                fill="#000000"
                stroke="none"
                style="stroke-width: 24.238"
              />
              <path
                id="path14"
                d="m -2838.9077,30884.639 v 194.445 h 13.3333 l -23.3321,38.888 -23.3346,-38.888 h 13.3333 v -194.445 z"
                fill="#000000"
                stroke="none"
                style="stroke-width: 24.238"
              />
            </g>
            <g id="g15" />
          </g>
        </g>
        <g
          id="g25"
          class="com.sun.star.drawing.ClosedBezierShape"
        >
          <g id="g18">
            <path
              id="path17"
              d="M 661.11113,700.00002 V 131.59223 l 38.88831,-53.81445 38.88947,53.8143 v 568.40794 z"
              fill="#1565c0"
              stroke="none"
              style="stroke-width: 17.1546"
            />
            <text
              id="text17"
              xml:space="preserve"
              style="
                font-size: 63.0799px;
                text-align: start;
                writing-mode: lr-tb;
                direction: ltr;
                text-anchor: start;
                fill: #ffffff;
                stroke-width: 38.9365;
              "
              x="701.77631"
              y="179.69041"
              transform="scale(0.96576588,1.0354476)"
            >
              1
            </text>
          </g>
          <g id="g24">
            <g id="g19">
              <path
                id="path18"
                d="M 621.66709,364.92557 V 170.48063 h -11.11152 l 19.4435,-38.8884 19.44539,38.8884 h -11.11057 v 194.44494 z"
                fill="#000000"
                stroke="none"
                style="stroke-width: 22.1262"
              />
              <path
                id="path19"
                d="m 599.44446,131.59223 v 194.44503 h 11.11111 l -19.44345,38.88831 -19.44544,-38.88831 h 11.11111 V 131.59223 Z"
                fill="#000000"
                stroke="none"
                style="stroke-width: 22.1263"
              />
            </g>
            <g id="g22">
              <path
                id="path20"
                d="M 800.55599,364.92557 V 170.48063 h -11.11152 l 19.4435,-38.8884 19.44539,38.8884 h -11.11057 v 194.44494 z"
                fill="#000000"
                stroke="none"
                style="stroke-width: 22.1262"
              />
              <path
                id="path21"
                d="m 778.33336,131.59223 v 194.44503 h 11.11111 l -19.44345,38.88831 -19.44544,-38.88831 h 11.11111 V 131.59223 Z"
                fill="#000000"
                stroke="none"
                style="stroke-width: 22.1263"
              />
            </g>
            <g id="g23" />
          </g>
        </g>
      </g>

      <g
        id="nodes1To4"
        class="Page"
      >
        <g
          id="node4_group"
          class="com.sun.star.drawing.ClosedBezierShape"
          transform="rotate(-90,14358.457,17794.588)"
        >
          <g id="node4">
            <path
              id="path81"
              d="m 31414.156,4136.131 v -568.4076 l 38.889,-53.8146 38.889,53.8135 v 568.4087 z"
              :fill="getColorOfKnotenarm('4')"
              stroke="none"
            />
            <text
              id="text81"
              xml:space="preserve"
              style="
                font-size: 63.0899px;
                text-align: start;
                writing-mode: lr-tb;
                direction: ltr;
                text-anchor: start;
                fill: #ffffff;
                stroke-width: 38.9426;
              "
              x="3693.3091"
              y="-30336.191"
              transform="matrix(0,0.96513032,-1.0361295,0,0,0)"
              :style="{ cursor: getCursorType('4') }"
              @click="activateOrDeactivateTotalKnotenarm('4')"
            >
              4
            </text>
          </g>

          <g
            v-if="isKnotenarmAvailable('4')"
            id="node4_arrows"
          >
            <g
              v-if="zaehlung.zaehlart === Zaehlart.FJS"
              id="node4_left"
            >
              <path
                id="path82"
                d="m 31340.268,3567.7232 v 194.445 h 15.555 l -27.221,38.888 -27.223,-38.888 h 15.555 v -194.445 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('4LU')"
                @click="activateKnotenarm('4LU')"
              />
              <path
                id="path83"
                d="m 31363.6,3801.0562 v -194.445 h -15.556 l 27.221,-38.888 27.224,38.888 h -15.556 v 194.445 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('4LD')"
                @click="activateKnotenarm('4LD')"
              />
            </g>
            <g
              v-if="zaehlung.zaehlart === Zaehlart.FJS"
              id="node4_right"
            >
              <path
                id="path84"
                d="m 31542.49,3567.7232 v 194.445 h 15.555 l -27.22,38.888 -27.224,-38.888 h 15.555 v -194.445 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('4RU')"
                @click="activateKnotenarm('4RU')"
              />
              <path
                id="path85"
                d="m 31565.823,3801.0566 v -194.4453 h -15.555 l 27.221,-38.8881 27.223,38.8881 h -15.555 v 194.4453 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('4RD')"
                @click="activateKnotenarm('4RD')"
              />
            </g>
            <!--            <g-->
            <!--              v-if="zaehlung.zaehlart === Zaehlart.QU"-->
            <!--              id="node4_crossing"-->
            <!--            >-->
            <!--              <path-->
            <!--                id="path88"-->
            <!--                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"-->
            <!--                stroke="none"-->
            <!--                :style="{ cursor: 'pointer' }"-->
            <!--                :fill="calculateColor('4CL2R')"-->
            <!--                @click="activateKnotenarm('4CL2R')"-->
            <!--              />-->
            <!--              <path-->
            <!--                id="path89"-->
            <!--                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"-->
            <!--                stroke="none"-->
            <!--                :style="{ cursor: 'pointer' }"-->
            <!--                :fill="calculateColor('4CR2L')"-->
            <!--                @click="activateKnotenarm('4CR2L')"-->
            <!--              />-->
            <!--            </g>-->
          </g>
        </g>
        <g
          id="node3_group"
          class="com.sun.star.drawing.ClosedBezierShape"
          transform="rotate(180,14358.458,17794.588)"
        >
          <g id="node3">
            <path
              id="path72"
              d="m 27978.027,34889.176 v -568.409 l 38.889,-53.813 38.889,53.813 v 568.409 z"
              :fill="getColorOfKnotenarm('3')"
              stroke="none"
            />
            <text
              id="text72"
              xml:space="preserve"
              style="
                font-size: 63.0916px;
                text-align: start;
                writing-mode: lr-tb;
                direction: ltr;
                text-anchor: start;
                fill: #ffffff;
                stroke-width: 38.9437;
              "
              x="-29025.062"
              y="-33144.508"
              transform="scale(-0.96597078,-1.035228)"
              :style="{ cursor: getCursorType('3') }"
              @click="activateOrDeactivateTotalKnotenarm('3')"
            >
              3
            </text>
          </g>

          <!--          <g-->
          <!--            v-if="isKnotenarmAvailable('3')"-->
          <!--            id="node3_arrows"-->
          <!--          >-->
          <!--            <g-->
          <!--              v-if="zaehlung.zaehlart === Zaehlart.FJS"-->
          <!--              id="node3_left"-->
          <!--            >-->
          <!--              <path-->
          <!--                id="path73"-->
          <!--                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"-->
          <!--                stroke="none"-->
          <!--                :style="{ cursor: 'pointer' }"-->
          <!--                :fill="calculateColor('3LU')"-->
          <!--                @click="activateKnotenarm('3LU')"-->
          <!--              />-->
          <!--              <path-->
          <!--                id="path74"-->
          <!--                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"-->
          <!--                stroke="none"-->
          <!--                :style="{ cursor: 'pointer' }"-->
          <!--                :fill="calculateColor('3LD')"-->
          <!--                @click="activateKnotenarm('3LD')"-->
          <!--              />-->
          <!--            </g>-->
          <!--            <g-->
          <!--              v-if="zaehlung.zaehlart === Zaehlart.FJS"-->
          <!--              id="node3_right"-->
          <!--              transform="matrix(0.94605826,0,0,0.98386895,906.90013,274.96713)"-->
          <!--            >-->
          <!--              <path-->
          <!--                id="path75"-->
          <!--                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"-->
          <!--                stroke="none"-->
          <!--                :style="{ cursor: 'pointer' }"-->
          <!--                :fill="calculateColor('3RU')"-->
          <!--                @click="activateKnotenarm('3RU')"-->
          <!--              />-->
          <!--              <path-->
          <!--                id="path76"-->
          <!--                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"-->
          <!--                stroke="none"-->
          <!--                :style="{ cursor: 'pointer' }"-->
          <!--                :fill="calculateColor('3RD')"-->
          <!--                @click="activateKnotenarm('3RD')"-->
          <!--              />-->
          <!--            </g>-->
          <!--            <g-->
          <!--              v-if="zaehlung.zaehlart === Zaehlart.QU"-->
          <!--              id="node3_crossing"-->
          <!--              transform="matrix(0,0.94605826,-0.79773158,0,28267.575,4038.8282)"-->
          <!--            >-->
          <!--              <path-->
          <!--                id="path79"-->
          <!--                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"-->
          <!--                stroke="none"-->
          <!--                :style="{ cursor: 'pointer' }"-->
          <!--                :fill="calculateColor('3CL2R')"-->
          <!--                @click="activateKnotenarm('3CL2R')"-->
          <!--              />-->
          <!--              <path-->
          <!--                id="path80"-->
          <!--                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"-->
          <!--                stroke="none"-->
          <!--                :style="{ cursor: 'pointer' }"-->
          <!--                :fill="calculateColor('3CR2L')"-->
          <!--                @click="activateKnotenarm('3CR2L')"-->
          <!--              />-->
          <!--            </g>-->
          <!--          </g>-->
        </g>
        <g
          id="node2_group"
          class="com.sun.star.drawing.ClosedBezierShape"
          transform="rotate(90,14358.458,17794.588)"
        >
          <g id="node2">
            <path
              id="path54"
              d="m -2775.0189,31453.046 v -568.408 l 38.889,-53.814 38.889,53.813 v 568.409 z"
              :fill="getColorOfKnotenarm('2')"
              stroke="none"
            />
            <text
              id="text54"
              style="
                font-size: 63.0877px;
                text-align: start;
                writing-mode: lr-tb;
                direction: ltr;
                text-anchor: start;
                fill: #ffffff;
                stroke-width: 38.9413;
              "
              x="-32040.105"
              y="-2619.9963"
              transform="matrix(0,-0.96506671,1.0361978,0,0,0)"
              :style="{ cursor: getCursorType('2') }"
              @click="activateOrDeactivateTotalKnotenarm('2')"
            >
              2
            </text>
          </g>

          <g
            v-if="isKnotenarmAvailable('2')"
            id="node2_arrows"
          >
            <g
              v-if="zaehlung.zaehlart === Zaehlart.FJS"
              id="node2_left"
            >
              <path
                id="path55"
                d="m -2633.3522,31117.972 v -194.445 h -13.3333 l 23.3321,-38.888 23.3346,38.888 h -13.3333 v 194.445 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('2LU')"
                @click="activateKnotenarm('2LU')"
              />
              <path
                id="path56"
                d="m -2652.241,30884.639 v 194.445 h 13.3333 l -23.3322,38.888 -23.3345,-38.888 h 13.3333 v -194.445 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('2LD')"
                @click="activateKnotenarm('2LD')"
              />
            </g>
            <g
              v-if="zaehlung.zaehlart === Zaehlart.FJS"
              id="node2_right"
            >
              <path
                id="path57"
                d="m -2820.0189,31117.972 v -194.445 h -13.3333 l 23.3322,-38.888 23.3345,38.888 h -13.3333 v 194.445 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('2RU')"
                @click="activateKnotenarm('2RU')"
              />
              <path
                id="path58"
                d="m -2838.9077,30884.639 v 194.445 h 13.3333 l -23.3321,38.888 -23.3346,-38.888 h 13.3333 v -194.445 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('2RD')"
                @click="activateKnotenarm('2RD')"
              />
            </g>
            <!--            <g-->
            <!--              v-if="zaehlung.zaehlart === Zaehlart.QU"-->
            <!--              id="node2_crossing"-->
            <!--              transform="matrix(0,0.94605826,-0.79773158,0,28267.575,4038.8282)"-->
            <!--            >-->
            <!--              <path-->
            <!--                id="path61"-->
            <!--                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"-->
            <!--                stroke="none"-->
            <!--                :style="{ cursor: 'pointer' }"-->
            <!--                :fill="calculateColor('2CL2R')"-->
            <!--                @click="activateKnotenarm('2CL2R')"-->
            <!--              />-->
            <!--              <path-->
            <!--                id="path62"-->
            <!--                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"-->
            <!--                stroke="none"-->
            <!--                :style="{ cursor: 'pointer' }"-->
            <!--                :fill="calculateColor('2CR2L')"-->
            <!--                @click="activateKnotenarm('2CR2L')"-->
            <!--              />-->
            <!--            </g>-->
          </g>
        </g>
        <g
          id="node1_group"
          class="com.sun.star.drawing.ClosedBezierShape"
        >
          <g id="node1">
            <path
              id="path1"
              d="M 661.11113,700.00002 V 131.59223 l 38.88831,-53.81445 38.88947,53.8143 v 568.40794 z"
              :fill="getColorOfKnotenarm('1')"
              stroke="none"
            />
            <text
              id="text1"
              xml:space="preserve"
              style="
                font-size: 63.0799px;
                text-align: start;
                writing-mode: lr-tb;
                direction: ltr;
                text-anchor: start;
                fill: #ffffff;
                stroke-width: 38.9365;
              "
              x="701.77631"
              y="179.69041"
              transform="scale(0.96576588,1.0354476)"
              :style="{ cursor: getCursorType('1') }"
              @click="activateOrDeactivateTotalKnotenarm('1')"
            >
              1
            </text>
          </g>

          <g
            v-if="isKnotenarmAvailable('1')"
            id="node1_arrows"
          >
            <g
              v-if="zaehlung.zaehlart === Zaehlart.FJS"
              id="node1_left"
            >
              <path
                id="path19"
                d="M 621.66709,364.92557 V 170.48063 h -11.11152 l 19.4435,-38.8884 19.44539,38.8884 h -11.11057 v 194.44494 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('1LU')"
                @click="activateKnotenarm('1LU')"
              />
              <path
                id="path20"
                d="m 599.44446,131.59223 v 194.44503 h 11.11111 l -19.44345,38.88831 -19.44544,-38.88831 h 11.11111 V 131.59223 Z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('1LD')"
                @click="activateKnotenarm('1LD')"
              />
            </g>
            <g
              v-if="zaehlung.zaehlart === Zaehlart.FJS"
              id="node1_right"
            >
              <path
                id="path39"
                d="M 800.55599,364.92557 V 170.48063 h -11.11152 l 19.4435,-38.8884 19.44539,38.8884 h -11.11057 v 194.44494 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('1RU')"
                @click="activateKnotenarm('1RU')"
              />
              <path
                id="path40"
                d="m 778.33336,131.59223 v 194.44503 h 11.11111 l -19.44345,38.88831 -19.44544,-38.88831 h 11.11111 V 131.59223 Z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColor('1RD')"
                @click="activateKnotenarm('1RD')"
              />
            </g>
            <!--            <g-->
            <!--              v-if="zaehlung.zaehlart === Zaehlart.QU"-->
            <!--              id="node1_crossing"-->
            <!--              transform="matrix(0,0.94605826,-0.79773158,0,28267.575,4038.8282)"-->
            <!--            >-->
            <!--              <path-->
            <!--                id="path43"-->
            <!--                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"-->
            <!--                stroke="none"-->
            <!--                :style="{ cursor: 'pointer' }"-->
            <!--                :fill="calculateColor('1CL2R')"-->
            <!--                @click="activateKnotenarm('1CL2R')"-->
            <!--              />-->
            <!--              <path-->
            <!--                id="path44"-->
            <!--                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"-->
            <!--                stroke="none"-->
            <!--                :style="{ cursor: 'pointer' }"-->
            <!--                :fill="calculateColor('1CR2L')"-->
            <!--                @click="activateKnotenarm('1CR2L')"-->
            <!--              />-->
            <!--            </g>-->
          </g>
        </g>
      </g>

      <path
        v-if="hasAvailableKnotenarme"
        id="center"
        d="m 14253.004,17465.11 166.703,0 117.876,117.877 0,166.702 -117.876,117.877 -166.703,0 -117.876,-117.877 0,-166.702 z"
        fill="#1565c0"
        transform="matrix(0.46656362,0,0,0.46656362,-5988.8219,-7542.4705)"
      />
    </svg>
  </v-sheet>
</template>

<script setup lang="ts">
import type ZaehlungDTO from "@/types/zaehlung/ZaehlungDTO";

import { isEmpty } from "lodash";
import { computed, onMounted, watch } from "vue";

import { useEventbus } from "@/store/Eventbus";
import Zaehlart from "@/types/enum/Zaehlart";

interface Props {
  height: string;
}
defineProps<Props>();

const zaehlung = defineModel<ZaehlungDTO>("zaehlung", {
  required: true,
});

const activeColor = "#D50000";
const passiveColor = "#9E9E9E";

const availableKnotenarme = computed(() => {
  return zaehlung.value.knotenarme.map((arm) => `${arm.nummer}`);
});
const hasAvailableKnotenarme = computed(() => {
  return availableKnotenarme.value.length > 0;
});

const eventbus = useEventbus();
const selectedKnotenarme = computed(() => {
  return eventbus.getSelectedKnotenarme;
});

onMounted(() => {
  resetForm();
});

watch(
  () => zaehlung.value.knotenarme,
  () => {
    resetForm();
  },
  { deep: true, immediate: true }
);

function isKnotenarmAvailable(knotenarm: string): boolean {
  return availableKnotenarme.value.includes(knotenarm);
}
/**
 * Wenn die Knotenarmnummer im Array gefunden wurde, wird diese in der Grafik in der "activeColor" dargestellt,
 * ansonsten in der "passiveColor".
 */
function calculateColor(knotenarm: string): string | undefined {
  let color = passiveColor;
  if (
    !isEmpty(
      selectedKnotenarme.value.filter(
        (selectedKnotenarm) => selectedKnotenarm === knotenarm
      )
    )
  ) {
    color = activeColor;
  }
  return color;
}

function activateKnotenarm(knotenarm: string) {
  eventbus.activateKnotenarm(knotenarm);
}

function activateOrDeactivateTotalKnotenarm(knotenarm: string) {
  if (!isKnotenarmAvailable(knotenarm)) {
    // remove all
    return;
  }

  const endings = [];

  if (zaehlung.value.zaehlart === Zaehlart.QU) {
    endings.push("CL2R");
    endings.push("CR2L");
  }
  if (zaehlung.value.zaehlart === Zaehlart.FJS) {
    endings.push("LU");
    endings.push("LD");
    endings.push("RU");
    endings.push("RD");
  }

  const knotenarmStrings = endings.map((value) => knotenarm + value);

  let nothingRemoved = true;

  knotenarmStrings.forEach((knotenarmString) => {
    if (selectedKnotenarme.value.includes(knotenarmString)) {
      nothingRemoved = false;
      eventbus.deactivateKnotenarm(knotenarmString);
    }
  });

  if (nothingRemoved && isKnotenarmAvailable(knotenarm)) {
    knotenarmStrings.forEach((value) => {
      activateKnotenarm(value);
    });
  }
}

function getCursorType(knotenarm: string) {
  if (isKnotenarmAvailable(knotenarm)) {
    return `pointer`;
  } else {
    return "default";
  }
}

function getColorOfKnotenarm(knotenarm: string) {
  if (isKnotenarmAvailable(knotenarm)) {
    return `#1565C0`;
  } else {
    return `#EEEEEE`;
  }
}

function resetForm() {
  eventbus.resetSelectedKnotenarme();
}
</script>
