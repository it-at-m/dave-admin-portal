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
      viewBox="13891 17287 1111 1111"
      preserveAspectRatio="xMidYMid"
      fill-rule="evenodd"
      stroke-width="28.222"
      stroke-linejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      xml:space="preserve"
    >
      <g
        id="nodes5To8"
        class="Page"
        transform="rotate(45,14344.644,17924.82)"
      >
        <g
          id="node8_group"
          class="com.sun.star.drawing.ClosedBezierShape"
          transform="rotate(-90,14358.457,17794.588)"
        >
          <g
            id="node8"
            transform="matrix(1,0,0,1.0009009,-18.516399,-18.516303)"
          >
            <path
              id="path117"
              d="m 14332.005,17842 v -507 l 44.969,-48 44.969,48 v 507 z"
              :fill="getColorOfKnotenarm('8')"
              stroke="none"
            />
            <text
              id="text117"
              xml:space="preserve"
              style="
                font-size: 63.0885px;
                text-align: start;
                writing-mode: lr-tb;
                direction: ltr;
                text-anchor: start;
                fill: #ffffff;
                stroke-width: 38.9418;
              "
              x="23207.291"
              y="2053.7427"
              transform="matrix(0.68301124,0.68239646,-0.73271189,0.73205238,0,0)"
              :style="{ cursor: getCursorType('8') }"
              @click="activateOrDeactivateTotalKnotenarm('8')"
            >
              8
            </text>
          </g>
          <g
            v-if="isKnotenarmAvailable('8')"
            id="node8_arrows"
          >
            <g
              v-if="zaehlung.zaehlart === Zaehlart.FJS"
              id="node8_left"
              transform="matrix(0.94605826,0,0,0.98386895,758.7668,274.96713)"
            >
              <path
                id="path118"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="
                  calculateColorOfLaengsverkehr(
                    8,
                    Bewegungsrichtung.AUS,
                    Himmelsrichtung.SW
                  )
                "
                @click="
                  handleClickOnLaengsverkehr(
                    8,
                    Bewegungsrichtung.AUS,
                    Himmelsrichtung.SW
                  )
                "
              />
              <path
                id="path119"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="
                  calculateColorOfLaengsverkehr(
                    8,
                    Bewegungsrichtung.EIN,
                    Himmelsrichtung.SW
                  )
                "
                @click="
                  handleClickOnLaengsverkehr(
                    8,
                    Bewegungsrichtung.EIN,
                    Himmelsrichtung.SW
                  )
                "
              />
            </g>
            <g
              v-if="zaehlung.zaehlart === Zaehlart.FJS"
              id="node8_right"
              transform="matrix(0.94605826,0,0,0.98386895,906.90013,274.96713)"
            >
              <path
                id="path120"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="
                  calculateColorOfLaengsverkehr(
                    8,
                    Bewegungsrichtung.AUS,
                    Himmelsrichtung.NO
                  )
                "
                @click="
                  handleClickOnLaengsverkehr(
                    8,
                    Bewegungsrichtung.AUS,
                    Himmelsrichtung.NO
                  )
                "
              />
              <path
                id="path121"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="
                  calculateColorOfLaengsverkehr(
                    8,
                    Bewegungsrichtung.EIN,
                    Himmelsrichtung.NO
                  )
                "
                @click="
                  handleClickOnLaengsverkehr(
                    8,
                    Bewegungsrichtung.EIN,
                    Himmelsrichtung.NO
                  )
                "
              />
            </g>
            <g
              v-if="zaehlung.zaehlart === Zaehlart.QU"
              id="node8_crossing"
              transform="matrix(0,0.94605826,-0.79773158,0,28267.575,4038.8282)"
            >
              <path
                id="path124"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColorOfQuerungsverkehr(8, Himmelsrichtung.NO)"
                @click="handleClickOnQuerungsverkehr(8, Himmelsrichtung.NO)"
              />
              <path
                id="path125"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColorOfQuerungsverkehr(8, Himmelsrichtung.SW)"
                @click="handleClickOnQuerungsverkehr(8, Himmelsrichtung.SW)"
              />
            </g>
          </g>
        </g>
        <g
          id="node7_group"
          class="com.sun.star.drawing.ClosedBezierShape"
          transform="rotate(180,14358.458,17794.588)"
        >
          <g
            id="node7"
            transform="matrix(1,0,0,1.0009009,-18.516399,-18.516303)"
          >
            <path
              id="path108"
              d="m 14332.005,17842 v -507 l 44.969,-48 44.969,48 v 507 z"
              :fill="getColorOfKnotenarm('7')"
              stroke="none"
            />
            <text
              id="text108"
              xml:space="preserve"
              style="
                font-size: 63.0885px;
                text-align: start;
                writing-mode: lr-tb;
                direction: ltr;
                text-anchor: start;
                fill: #ffffff;
                stroke-width: 38.9418;
              "
              x="2159.0249"
              y="-21628.908"
              transform="matrix(-0.68301123,0.68239646,-0.73271189,-0.73205239,0,0)"
              :style="{ cursor: getCursorType('7') }"
              @click="activateOrDeactivateTotalKnotenarm('7')"
            >
              7
            </text>
          </g>
          <g
            v-if="isKnotenarmAvailable('7')"
            id="node7_arrows"
          >
            <g
              v-if="zaehlung.zaehlart === Zaehlart.FJS"
              id="node7_left"
              transform="matrix(0.94605826,0,0,0.98386895,758.7668,274.96713)"
            >
              <path
                id="path109"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="
                  calculateColorOfLaengsverkehr(
                    7,
                    Bewegungsrichtung.AUS,
                    Himmelsrichtung.SO
                  )
                "
                @click="
                  handleClickOnLaengsverkehr(
                    7,
                    Bewegungsrichtung.AUS,
                    Himmelsrichtung.SO
                  )
                "
              />
              <path
                id="path110"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="
                  calculateColorOfLaengsverkehr(
                    7,
                    Bewegungsrichtung.EIN,
                    Himmelsrichtung.SO
                  )
                "
                @click="
                  handleClickOnLaengsverkehr(
                    7,
                    Bewegungsrichtung.EIN,
                    Himmelsrichtung.SO
                  )
                "
              />
            </g>
            <g
              v-if="zaehlung.zaehlart === Zaehlart.FJS"
              id="node7_right"
              transform="matrix(0.94605826,0,0,0.98386895,906.90013,274.96713)"
            >
              <path
                id="path111"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="
                  calculateColorOfLaengsverkehr(
                    7,
                    Bewegungsrichtung.AUS,
                    Himmelsrichtung.NW
                  )
                "
                @click="
                  handleClickOnLaengsverkehr(
                    7,
                    Bewegungsrichtung.AUS,
                    Himmelsrichtung.NW
                  )
                "
              />
              <path
                id="path112"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="
                  calculateColorOfLaengsverkehr(
                    7,
                    Bewegungsrichtung.EIN,
                    Himmelsrichtung.NW
                  )
                "
                @click="
                  handleClickOnLaengsverkehr(
                    7,
                    Bewegungsrichtung.EIN,
                    Himmelsrichtung.NW
                  )
                "
              />
            </g>
            <g
              v-if="zaehlung.zaehlart === Zaehlart.QU"
              id="node7_crossing"
              transform="matrix(0,0.94605826,-0.79773158,0,28267.575,4038.8282)"
            >
              <path
                id="path115"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColorOfQuerungsverkehr(7, Himmelsrichtung.NW)"
                @click="handleClickOnQuerungsverkehr(7, Himmelsrichtung.NW)"
              />
              <path
                id="path116"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColorOfQuerungsverkehr(7, Himmelsrichtung.SO)"
                @click="handleClickOnQuerungsverkehr(7, Himmelsrichtung.SO)"
              />
            </g>
          </g>
        </g>
        <g
          id="node6_group"
          class="com.sun.star.drawing.ClosedBezierShape"
          transform="rotate(90,14358.458,17794.588)"
        >
          <g
            id="node6"
            transform="matrix(1,0,0,1.0009009,-18.516399,-18.516303)"
          >
            <path
              id="path99"
              d="m 14332.005,17842 v -507 l 44.969,-48 44.969,48 v 507 z"
              :fill="getColorOfKnotenarm('6')"
              stroke="none"
            />
            <text
              id="text99"
              xml:space="preserve"
              style="
                font-size: 63.0885px;
                text-align: start;
                writing-mode: lr-tb;
                direction: ltr;
                text-anchor: start;
                fill: #ffffff;
                stroke-width: 38.9418;
              "
              x="-23247.984"
              y="-2008.0264"
              transform="matrix(-0.68301123,-0.68239646,0.73271189,-0.73205239,0,0)"
              :style="{ cursor: getCursorType('6') }"
              @click="activateOrDeactivateTotalKnotenarm('6')"
            >
              6
            </text>
          </g>
          <g
            v-if="isKnotenarmAvailable('6')"
            id="node6_arrows"
          >
            <g
              v-if="zaehlung.zaehlart === Zaehlart.FJS"
              id="node6_left"
              transform="matrix(0.94605826,0,0,0.98386895,758.7668,274.96713)"
            >
              <path
                id="path100"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="
                  calculateColorOfLaengsverkehr(
                    6,
                    Bewegungsrichtung.AUS,
                    Himmelsrichtung.NO
                  )
                "
                @click="
                  handleClickOnLaengsverkehr(
                    6,
                    Bewegungsrichtung.AUS,
                    Himmelsrichtung.NO
                  )
                "
              />
              <path
                id="path101"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="
                  calculateColorOfLaengsverkehr(
                    6,
                    Bewegungsrichtung.EIN,
                    Himmelsrichtung.NO
                  )
                "
                @click="
                  handleClickOnLaengsverkehr(
                    6,
                    Bewegungsrichtung.EIN,
                    Himmelsrichtung.NO
                  )
                "
              />
            </g>
            <g
              v-if="zaehlung.zaehlart === Zaehlart.FJS"
              id="node6_right"
              transform="matrix(0.94605826,0,0,0.98386895,906.90013,274.96713)"
            >
              <path
                id="path102"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="
                  calculateColorOfLaengsverkehr(
                    6,
                    Bewegungsrichtung.AUS,
                    Himmelsrichtung.SW
                  )
                "
                @click="
                  handleClickOnLaengsverkehr(
                    6,
                    Bewegungsrichtung.AUS,
                    Himmelsrichtung.SW
                  )
                "
              />
              <path
                id="path103"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="
                  calculateColorOfLaengsverkehr(
                    6,
                    Bewegungsrichtung.EIN,
                    Himmelsrichtung.SW
                  )
                "
                @click="
                  handleClickOnLaengsverkehr(
                    6,
                    Bewegungsrichtung.EIN,
                    Himmelsrichtung.SW
                  )
                "
              />
            </g>
            <g
              v-if="zaehlung.zaehlart === Zaehlart.QU"
              id="node6_crossing"
              transform="matrix(0,0.94605826,-0.79773158,0,28267.575,4038.8282)"
            >
              <path
                id="path106"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColorOfQuerungsverkehr(6, Himmelsrichtung.SW)"
                @click="handleClickOnQuerungsverkehr(6, Himmelsrichtung.SW)"
              />
              <path
                id="path107"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColorOfQuerungsverkehr(6, Himmelsrichtung.NO)"
                @click="handleClickOnQuerungsverkehr(6, Himmelsrichtung.NO)"
              />
            </g>
          </g>
        </g>
        <g
          id="node5_group"
          class="com.sun.star.drawing.ClosedBezierShape"
        >
          <g
            id="node5_arrow"
            transform="matrix(1,0,0,1.0009009,-18.516399,-18.516303)"
          >
            <path
              id="path90"
              d="m 14332.005,17842 v -507 l 44.969,-48 44.969,48 v 507 z"
              :fill="getColorOfKnotenarm('5')"
              stroke="none"
            />
            <text
              id="text90"
              xml:space="preserve"
              style="
                font-size: 63.0885px;
                text-align: start;
                writing-mode: lr-tb;
                direction: ltr;
                text-anchor: start;
                fill: #ffffff;
                stroke-width: 38.9418;
              "
              x="-2199.2236"
              y="21674.625"
              transform="matrix(0.68301124,-0.68239646,0.73271189,0.73205238,0,0)"
              :style="{ cursor: getCursorType('5') }"
              @click="activateOrDeactivateTotalKnotenarm('5')"
            >
              5
            </text>
          </g>
          <g
            v-if="isKnotenarmAvailable('5')"
            id="node5_arrows"
          >
            <g
              v-if="zaehlung.zaehlart === Zaehlart.FJS"
              id="node5_left"
              transform="matrix(0.94605826,0,0,0.98386895,758.7668,274.96713)"
            >
              <path
                id="path91"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="
                  calculateColorOfLaengsverkehr(
                    5,
                    Bewegungsrichtung.AUS,
                    Himmelsrichtung.NW
                  )
                "
                @click="
                  handleClickOnLaengsverkehr(
                    5,
                    Bewegungsrichtung.AUS,
                    Himmelsrichtung.NW
                  )
                "
              />
              <path
                id="path92"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="
                  calculateColorOfLaengsverkehr(
                    5,
                    Bewegungsrichtung.EIN,
                    Himmelsrichtung.NW
                  )
                "
                @click="
                  handleClickOnLaengsverkehr(
                    5,
                    Bewegungsrichtung.EIN,
                    Himmelsrichtung.NW
                  )
                "
              />
            </g>
            <g
              v-if="zaehlung.zaehlart === Zaehlart.FJS"
              id="node5_right"
              transform="matrix(0.94605826,0,0,0.98386895,906.90013,274.96713)"
            >
              <path
                id="path93"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="
                  calculateColorOfLaengsverkehr(
                    5,
                    Bewegungsrichtung.AUS,
                    Himmelsrichtung.SO
                  )
                "
                @click="
                  handleClickOnLaengsverkehr(
                    5,
                    Bewegungsrichtung.AUS,
                    Himmelsrichtung.SO
                  )
                "
              />
              <path
                id="path94"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="
                  calculateColorOfLaengsverkehr(
                    5,
                    Bewegungsrichtung.EIN,
                    Himmelsrichtung.SO
                  )
                "
                @click="
                  handleClickOnLaengsverkehr(
                    5,
                    Bewegungsrichtung.EIN,
                    Himmelsrichtung.SO
                  )
                "
              />
            </g>
            <g
              v-if="zaehlung.zaehlart === Zaehlart.QU"
              id="node5_crossing"
              transform="matrix(0,0.94605826,-0.79773158,0,28267.575,4038.8282)"
            >
              <path
                id="path97"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColorOfQuerungsverkehr(5, Himmelsrichtung.SO)"
                @click="handleClickOnQuerungsverkehr(5, Himmelsrichtung.SO)"
              />
              <path
                id="path98"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColorOfQuerungsverkehr(5, Himmelsrichtung.NW)"
                @click="handleClickOnQuerungsverkehr(5, Himmelsrichtung.NW)"
              />
            </g>
          </g>
        </g>
      </g>

      <g
        id="nodes1To4"
        class="Page"
        transform="translate(88.042487,47.911987)"
      >
        <g
          id="node4_group"
          class="com.sun.star.drawing.ClosedBezierShape"
          transform="rotate(-90,14358.457,17794.588)"
        >
          <g
            id="node4"
            transform="matrix(1,0,0,1.0009009,-18.516399,-18.516303)"
          >
            <path
              id="path81"
              d="m 14332.005,17842 v -507 l 44.969,-48 44.969,48 v 507 z"
              :fill="getColorOfKnotenarm('4')"
              stroke="none"
            />
            <text
              id="text81"
              xml:space="preserve"
              style="
                font-size: 63.0885px;
                text-align: start;
                writing-mode: lr-tb;
                direction: ltr;
                text-anchor: start;
                fill: #ffffff;
                stroke-width: 38.9418;
              "
              x="17945.223"
              y="-13850.833"
              transform="matrix(0,0.96505434,-1.0362111,0,0,0)"
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
              transform="matrix(0.94605826,0,0,0.98386895,758.7668,274.96713)"
            >
              <path
                id="path82"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="
                  calculateColorOfLaengsverkehr(
                    4,
                    Bewegungsrichtung.AUS,
                    Himmelsrichtung.S
                  )
                "
                @click="
                  handleClickOnLaengsverkehr(
                    4,
                    Bewegungsrichtung.AUS,
                    Himmelsrichtung.S
                  )
                "
              />
              <path
                id="path83"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="
                  calculateColorOfLaengsverkehr(
                    4,
                    Bewegungsrichtung.EIN,
                    Himmelsrichtung.S
                  )
                "
                @click="
                  handleClickOnLaengsverkehr(
                    4,
                    Bewegungsrichtung.EIN,
                    Himmelsrichtung.S
                  )
                "
              />
            </g>
            <g
              v-if="zaehlung.zaehlart === Zaehlart.FJS"
              id="node4_right"
              transform="matrix(0.94605826,0,0,0.98386895,906.90013,274.96713)"
            >
              <path
                id="path84"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="
                  calculateColorOfLaengsverkehr(
                    4,
                    Bewegungsrichtung.AUS,
                    Himmelsrichtung.N
                  )
                "
                @click="
                  handleClickOnLaengsverkehr(
                    4,
                    Bewegungsrichtung.AUS,
                    Himmelsrichtung.N
                  )
                "
              />
              <path
                id="path85"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="
                  calculateColorOfLaengsverkehr(
                    4,
                    Bewegungsrichtung.EIN,
                    Himmelsrichtung.N
                  )
                "
                @click="
                  handleClickOnLaengsverkehr(
                    4,
                    Bewegungsrichtung.EIN,
                    Himmelsrichtung.N
                  )
                "
              />
            </g>
            <g
              v-if="zaehlung.zaehlart === Zaehlart.QU"
              id="node4_crossing"
              transform="matrix(0,0.94605826,-0.79773158,0,28267.575,4038.8282)"
            >
              <path
                id="path88"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColorOfQuerungsverkehr(4, Himmelsrichtung.N)"
                @click="handleClickOnQuerungsverkehr(4, Himmelsrichtung.N)"
              />
              <path
                id="path89"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColorOfQuerungsverkehr(4, Himmelsrichtung.S)"
                @click="handleClickOnQuerungsverkehr(4, Himmelsrichtung.S)"
              />
            </g>
          </g>
        </g>
        <g
          id="node3_group"
          class="com.sun.star.drawing.ClosedBezierShape"
          transform="rotate(180,14358.458,17794.588)"
        >
          <g
            id="node3"
            transform="matrix(1,0,0,1.0009009,-18.516399,-18.516303)"
          >
            <path
              id="path72"
              d="m 14332.005,17842 v -507 l 44.969,-48 44.969,48 v 507 z"
              :fill="getColorOfKnotenarm('3')"
              stroke="none"
            />
            <text
              id="text72"
              xml:space="preserve"
              style="
                font-size: 63.0885px;
                text-align: start;
                writing-mode: lr-tb;
                direction: ltr;
                text-anchor: start;
                fill: #ffffff;
                stroke-width: 38.9418;
              "
              x="-14903.439"
              y="-16723.537"
              transform="scale(-0.96592375,-1.0352784)"
              :style="{ cursor: getCursorType('3') }"
              @click="activateOrDeactivateTotalKnotenarm('3')"
            >
              3
            </text>
          </g>

          <g
            v-if="isKnotenarmAvailable('3')"
            id="node3_arrows"
          >
            <g
              v-if="zaehlung.zaehlart === Zaehlart.FJS"
              id="node3_left"
              transform="matrix(0.94605826,0,0,0.98386895,758.7668,274.96713)"
            >
              <path
                id="path73"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="
                  calculateColorOfLaengsverkehr(
                    3,
                    Bewegungsrichtung.AUS,
                    Himmelsrichtung.O
                  )
                "
                @click="
                  handleClickOnLaengsverkehr(
                    3,
                    Bewegungsrichtung.AUS,
                    Himmelsrichtung.O
                  )
                "
              />
              <path
                id="path74"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="
                  calculateColorOfLaengsverkehr(
                    3,
                    Bewegungsrichtung.EIN,
                    Himmelsrichtung.O
                  )
                "
                @click="
                  handleClickOnLaengsverkehr(
                    3,
                    Bewegungsrichtung.EIN,
                    Himmelsrichtung.O
                  )
                "
              />
            </g>
            <g
              v-if="zaehlung.zaehlart === Zaehlart.FJS"
              id="node3_right"
              transform="matrix(0.94605826,0,0,0.98386895,906.90013,274.96713)"
            >
              <path
                id="path75"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="
                  calculateColorOfLaengsverkehr(
                    3,
                    Bewegungsrichtung.AUS,
                    Himmelsrichtung.W
                  )
                "
                @click="
                  handleClickOnLaengsverkehr(
                    3,
                    Bewegungsrichtung.AUS,
                    Himmelsrichtung.W
                  )
                "
              />
              <path
                id="path76"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="
                  calculateColorOfLaengsverkehr(
                    3,
                    Bewegungsrichtung.EIN,
                    Himmelsrichtung.W
                  )
                "
                @click="
                  handleClickOnLaengsverkehr(
                    3,
                    Bewegungsrichtung.EIN,
                    Himmelsrichtung.W
                  )
                "
              />
            </g>
            <g
              v-if="zaehlung.zaehlart === Zaehlart.QU"
              id="node3_crossing"
              transform="matrix(0,0.94605826,-0.79773158,0,28267.575,4038.8282)"
            >
              <path
                id="path79"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColorOfQuerungsverkehr(3, Himmelsrichtung.W)"
                @click="handleClickOnQuerungsverkehr(3, Himmelsrichtung.W)"
              />
              <path
                id="path80"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColorOfQuerungsverkehr(3, Himmelsrichtung.O)"
                @click="handleClickOnQuerungsverkehr(3, Himmelsrichtung.O)"
              />
            </g>
          </g>
        </g>
        <g
          id="node2_group"
          class="com.sun.star.drawing.ClosedBezierShape"
          transform="rotate(90,14358.458,17794.588)"
        >
          <g
            id="node2"
            transform="matrix(1,0,0,1.0009009,-18.516399,-18.516303)"
          >
            <path
              id="path54"
              d="m 14332.005,17842 v -507 l 44.969,-48 44.969,48 v 507 z"
              :fill="getColorOfKnotenarm('2')"
              stroke="none"
            />
            <text
              id="text54"
              xml:space="preserve"
              style="
                font-size: 63.0885px;
                text-align: start;
                writing-mode: lr-tb;
                direction: ltr;
                text-anchor: start;
                fill: #ffffff;
                stroke-width: 38.9418;
              "
              x="-17983.836"
              y="13896.666"
              transform="matrix(0,-0.96505434,1.0362111,0,0,0)"
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
              transform="matrix(0.94605826,0,0,0.98386895,758.7668,274.96713)"
            >
              <path
                id="path55"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="
                  calculateColorOfLaengsverkehr(
                    2,
                    Bewegungsrichtung.AUS,
                    Himmelsrichtung.N
                  )
                "
                @click="
                  handleClickOnLaengsverkehr(
                    2,
                    Bewegungsrichtung.AUS,
                    Himmelsrichtung.N
                  )
                "
              />
              <path
                id="path56"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="
                  calculateColorOfLaengsverkehr(
                    2,
                    Bewegungsrichtung.EIN,
                    Himmelsrichtung.N
                  )
                "
                @click="
                  handleClickOnLaengsverkehr(
                    2,
                    Bewegungsrichtung.EIN,
                    Himmelsrichtung.N
                  )
                "
              />
            </g>
            <g
              v-if="zaehlung.zaehlart === Zaehlart.FJS"
              id="node2_right"
              transform="matrix(0.94605826,0,0,0.98386895,906.90013,274.96713)"
            >
              <path
                id="path57"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="
                  calculateColorOfLaengsverkehr(
                    2,
                    Bewegungsrichtung.AUS,
                    Himmelsrichtung.S
                  )
                "
                @click="
                  handleClickOnLaengsverkehr(
                    2,
                    Bewegungsrichtung.AUS,
                    Himmelsrichtung.S
                  )
                "
              />
              <path
                id="path58"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="
                  calculateColorOfLaengsverkehr(
                    2,
                    Bewegungsrichtung.EIN,
                    Himmelsrichtung.S
                  )
                "
                @click="
                  handleClickOnLaengsverkehr(
                    2,
                    Bewegungsrichtung.EIN,
                    Himmelsrichtung.S
                  )
                "
              />
            </g>
            <g
              v-if="zaehlung.zaehlart === Zaehlart.QU"
              id="node2_crossing"
              transform="matrix(0,0.94605826,-0.79773158,0,28267.575,4038.8282)"
            >
              <path
                id="path61"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColorOfQuerungsverkehr(2, Himmelsrichtung.S)"
                @click="handleClickOnQuerungsverkehr(2, Himmelsrichtung.S)"
              />
              <path
                id="path62"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColorOfQuerungsverkehr(2, Himmelsrichtung.N)"
                @click="handleClickOnQuerungsverkehr(2, Himmelsrichtung.N)"
              />
            </g>
          </g>
        </g>
        <g
          id="node1_group"
          class="com.sun.star.drawing.ClosedBezierShape"
        >
          <g
            id="node1"
            transform="matrix(1,0,0,1.0009009,-18.516399,-18.516303)"
          >
            <path
              id="path1"
              d="m 14332.005,17842 v -507 l 44.969,-48 44.969,48 v 507 z"
              :fill="getColorOfKnotenarm('1')"
              stroke="none"
            />
            <text
              id="text1"
              xml:space="preserve"
              style="
                font-size: 63.0885px;
                text-align: start;
                writing-mode: lr-tb;
                direction: ltr;
                text-anchor: start;
                fill: #ffffff;
                stroke-width: 38.9418;
              "
              x="14863.547"
              y="16769.467"
              transform="scale(0.96592375,1.0352784)"
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
              transform="matrix(0.94605826,0,0,0.98386895,758.7668,274.96713)"
            >
              <path
                id="path19"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="
                  calculateColorOfLaengsverkehr(
                    1,
                    Bewegungsrichtung.AUS,
                    Himmelsrichtung.W
                  )
                "
                @click="
                  handleClickOnLaengsverkehr(
                    1,
                    Bewegungsrichtung.AUS,
                    Himmelsrichtung.W
                  )
                "
              />
              <path
                id="path20"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="
                  calculateColorOfLaengsverkehr(
                    1,
                    Bewegungsrichtung.EIN,
                    Himmelsrichtung.W
                  )
                "
                @click="
                  handleClickOnLaengsverkehr(
                    1,
                    Bewegungsrichtung.EIN,
                    Himmelsrichtung.W
                  )
                "
              />
            </g>
            <g
              v-if="zaehlung.zaehlart === Zaehlart.FJS"
              id="node1_right"
              transform="matrix(0.94605826,0,0,0.98386895,906.90013,274.96713)"
            >
              <path
                id="path39"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="
                  calculateColorOfLaengsverkehr(
                    1,
                    Bewegungsrichtung.AUS,
                    Himmelsrichtung.O
                  )
                "
                @click="
                  handleClickOnLaengsverkehr(
                    1,
                    Bewegungsrichtung.AUS,
                    Himmelsrichtung.O
                  )
                "
              />
              <path
                id="path40"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="
                  calculateColorOfLaengsverkehr(
                    1,
                    Bewegungsrichtung.EIN,
                    Himmelsrichtung.O
                  )
                "
                @click="
                  handleClickOnLaengsverkehr(
                    1,
                    Bewegungsrichtung.EIN,
                    Himmelsrichtung.O
                  )
                "
              />
            </g>
            <g
              v-if="zaehlung.zaehlart === Zaehlart.QU"
              id="node1_crossing"
              transform="matrix(0,0.94605826,-0.79773158,0,28267.575,4038.8282)"
            >
              <path
                id="path43"
                d="m 14305.233,17535.315 v -165.798 h -5.582 l 9.768,-33.159 9.769,33.159 h -5.582 v 165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColorOfQuerungsverkehr(1, Himmelsrichtung.O)"
                @click="handleClickOnQuerungsverkehr(1, Himmelsrichtung.O)"
              />
              <path
                id="path44"
                d="m 14288.406,17336.358 v 165.798 h 5.582 l -9.768,33.159 -9.769,-33.159 h 5.582 v -165.798 z"
                stroke="none"
                :style="{ cursor: 'pointer' }"
                :fill="calculateColorOfQuerungsverkehr(1, Himmelsrichtung.W)"
                @click="handleClickOnQuerungsverkehr(1, Himmelsrichtung.W)"
              />
            </g>
          </g>
        </g>
      </g>

      <path
        v-if="hasAvailableKnotenarme"
        id="center"
        d="m 14253.004,17465.11 166.703,0 117.876,117.877 0,166.702 -117.876,117.877 -166.703,0 -117.876,-117.877 0,-166.702 z"
        transform="matrix(0.37991612,-0.37991612,0.37991612,0.37991612,2288.1609,16577.386)"
        fill="#1565c0"
      />
    </svg>
  </v-sheet>
</template>

<script setup lang="ts">
import type LaengsverkehrDTO from "@/types/zaehlung/LaengsverkehrDTO";
import type QuerungsverkehrDTO from "@/types/zaehlung/QuerungsverkehrDTO";
import type ZaehlungDTO from "@/types/zaehlung/ZaehlungDTO";

import { cloneDeep, isEmpty, toArray } from "lodash";
import { computed, onMounted, watch } from "vue";

import { useEventbus } from "@/store/Eventbus";
import Bewegungsrichtung from "@/types/enum/Bewegungsrichtung";
import Himmelsrichtung from "@/types/enum/Himmelsrichtung";
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

const selectedLaengsverkehre = computed(() => {
  return zaehlung.value.laengsverkehr;
});
const selectedQuerungsverkehre = computed(() => {
  return zaehlung.value.querungsverkehr;
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
 * Gibt den Wert der aktiven oder passiven Pfeilfarbe für den Längsverkehr zurück.
 *
 * @param knotenarm
 * @param richtung
 * @param strassenseite
 */
function calculateColorOfLaengsverkehr(
  knotenarm: number,
  richtung: Bewegungsrichtung,
  strassenseite: Himmelsrichtung
): string | undefined {
  let color = passiveColor;
  const clickedLaengsverkehr: LaengsverkehrDTO = createLaengsverkehr(
    knotenarm,
    richtung,
    strassenseite
  );
  const index =
    findIndexInSelectedLaengsverkehreForClickedLaengsverkehr(
      clickedLaengsverkehr
    );
  if (index > 0) {
    color = activeColor;
  }

  return color;
}

/**
 * Gibt den Wert der aktiven oder passiven Pfeilfarbe für den Querungsverkehr zurück.
 *
 * @param knotenarm
 * @param richtung
 */
function calculateColorOfQuerungsverkehr(
  knotenarm: number,
  richtung: Himmelsrichtung
): string | undefined {
  let color = passiveColor;
  const clickedQuerungsverkehr: QuerungsverkehrDTO = createQuerungsverkehr(
    knotenarm,
    richtung
  );
  const index = findIndexInSelectedQuerungsverkehreForClickedQuerungsverkehr(
    clickedQuerungsverkehr
  );
  if (index > 0) {
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

function handleClickOnLaengsverkehr(
  knotenarm: number,
  richtung: Bewegungsrichtung,
  strassenseite: Himmelsrichtung
): void {
  const clickedLaengsverkehr: LaengsverkehrDTO = createLaengsverkehr(
    knotenarm,
    richtung,
    strassenseite
  );

  const laengsverkehr = toArray(cloneDeep(selectedLaengsverkehre.value));

  const index =
    findIndexInSelectedLaengsverkehreForClickedLaengsverkehr(
      clickedLaengsverkehr
    );

  if (index > 0) {
    laengsverkehr.splice(index, 1);
  } else {
    laengsverkehr.push(clickedLaengsverkehr);
  }

  zaehlung.value.laengsverkehr = laengsverkehr;
}

function handleClickOnQuerungsverkehr(
  knotenarm: number,
  richtung: Himmelsrichtung
): void {
  const clickedQuerungsverkehr: QuerungsverkehrDTO = createQuerungsverkehr(
    knotenarm,
    richtung
  );

  const querungsverkehr = toArray(cloneDeep(selectedQuerungsverkehre.value));

  const index = findIndexInSelectedQuerungsverkehreForClickedQuerungsverkehr(
    clickedQuerungsverkehr
  );

  if (index > 0) {
    querungsverkehr.splice(index, 1);
  } else {
    querungsverkehr.push(clickedQuerungsverkehr);
  }

  zaehlung.value.querungsverkehr = querungsverkehr;
}

function findIndexInSelectedLaengsverkehreForClickedLaengsverkehr(
  clickedLaengsverkehr: LaengsverkehrDTO
) {
  return selectedLaengsverkehre.value.findIndex(
    (laengsverkehr: LaengsverkehrDTO) => {
      return (
        laengsverkehr.knotenarm === clickedLaengsverkehr.knotenarm &&
        laengsverkehr.richtung === clickedLaengsverkehr.richtung &&
        laengsverkehr.strassenseite === clickedLaengsverkehr.strassenseite
      );
    }
  );
}

function findIndexInSelectedQuerungsverkehreForClickedQuerungsverkehr(
  clickedQuerungsverkehr: QuerungsverkehrDTO
) {
  return selectedQuerungsverkehre.value.findIndex(
    (querungsverkehr: QuerungsverkehrDTO) => {
      return (
        querungsverkehr.knotenarm === clickedQuerungsverkehr.knotenarm &&
        querungsverkehr.richtung === clickedQuerungsverkehr.richtung
      );
    }
  );
}

selectedQuerungsverkehre;

function createLaengsverkehr(
  knotenarm: number,
  richtung: Bewegungsrichtung,
  strassenseite: Himmelsrichtung
): LaengsverkehrDTO {
  const laengsverkehr = {} as LaengsverkehrDTO;
  laengsverkehr.knotenarm = knotenarm;
  laengsverkehr.richtung = richtung;
  laengsverkehr.strassenseite = strassenseite;
  return laengsverkehr;
}

function createQuerungsverkehr(
  knotenarm: number,
  richtung: Himmelsrichtung
): QuerungsverkehrDTO {
  const querungsverkehr = {} as QuerungsverkehrDTO;
  querungsverkehr.knotenarm = knotenarm;
  querungsverkehr.richtung = richtung;
  return querungsverkehr;
}
</script>
